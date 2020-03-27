const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const xmlparser = require("js2xmlparser");
const utils = require("./controller_utils");

const default_path = path.join(__dirname, "../public/images/propics/default.png");


module.exports = {
    
    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getUserData(pool, req, res) {
        

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT name,surname,student_id,email,skills,phone_number,username,password,bio,is_recruiter,secondaryskills,domain FROM users where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        
        pool.query(query, function (err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no user with the given ID
            if(replies.length > 0) {
                if(preferredheader == "application/json")
                    res.status(200).json(utils.formatResponse(replies));
                else
                    res.type("application/xml").status(200).send(xmlparser.parse("user", utils.formatResponse(replies)));
                return;
            }
            else {
                res.status(404).send(utils.errorHandler(404));
                return;
            } 
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getUsersList(pool, req, res) {

        var metaWrapper = {
            page_number: req.params.p,
            page_length: req.query.pl,
            total_elements: ''
        };


        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        // First we count the number of users
        pool.query("SELECT COUNT(*) as users_number FROM users;", function(err, replies){
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                console.log(err);
                return;
            }
            if(replies.length <= 0) {
                res.status(204).send();
                return;
            }

            metaWrapper.total_elements = replies[0].users_number;
           
            var users_number = parseInt(replies[0].users_number);            
            var page = parseInt(req.query.p);
            var pageLength = parseInt(req.query.pl);

            if(!pageLength) pageLength = 25;
            if(!page) page = 1;

            var offset = pageLength * page - pageLength; // Quick maths BTW

            // If the offset is too big we put the offset to the last page but we keep the page length
            if(offset >= users_number) {
                offset = users_number - pageLength;
                metaWrapper.page_number = Math.floor(users_number / pageLength);
            }
            if(offset < 0) offset = 0;

            this.query = "SELECT name,surname,student_id,email,skills,phone_number,username,password,bio,is_recruiter,secondaryskills,domain FROM users LIMIT " + offset + "," + pageLength + ";";
        
            pool.query(this.query, function (err, replies){
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    console.log(err);
                    return;
                }
                // If the array length is <= 0 then there is no user with the given ID
                if(replies.length > 0) {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies, undefined, metaWrapper));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("user", utils.formatResponse(replies, undefined, metaWrapper)));
                    return;
                }
                else {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                }
            });
        });       
    },

   

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    createUser(pool, req, res, body) {

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "INSERT INTO users(name,surname,student_id,email,skills,phone_number,username,password,bio,is_recruiter,secondaryskills,domain) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
        var inserts = [body.name, body.surname, body.student_id, body.email, body.skills, body.phone_number, body.username, body.password, body.bio, body.is_recruiter, body.secondaryskills, body.domain];
        query = mysql.format(query,inserts);
        
        pool.query(query, function(err, replies) {
            if(err) {
                // Checking if there is a conflict error
                if(err.errno == 1062) {
                    console.log(err);
                    res.status(409).send(utils.errorHandler(409,err.sqlMessage));
                    return;
                }
                res.status(500).send(utils.errorHandler(500));
                console.log(err);
                return;
            }
            
            // Doing this here since we need the new resource ID to give the name to the image file
            var targetPath = default_path;
            // Only if we specified a propic to upload
            if(req.file) {
                const tempPath = req.file.path;
                const fileExt = path.extname(req.file.originalname).toLowerCase();
                targetPath = path.join(__dirname, "../public/images/propics/" + replies.insertId + fileExt);
        
                // Moves the file from temp folder to propics folder with the correct name and extention
                fs.rename(tempPath, targetPath, err => {
                    if(err) {
                        res.status(500).send(utils.errorHandler(500));
                        console.log(err);
                        return;
                    }
                });
            }

            var query = "UPDATE users SET propic = ? WHERE id = ?;";
            var inserts = [targetPath, replies.insertId];
            query = mysql.format(query,inserts);

            pool.query(query, function(err, replies) {
                if(err) {
                    console.log(err);
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }
            });

            // We attach the link to the new resource to the response
            replies.resource = "/api/users/" + replies.insertId;
            if(preferredheader == "application/json")
                res.status(201).json(utils.formatResponse(replies));
            else
                res.type("application/xml").status(201).send(xmlparser.parse("user", utils.formatResponse(replies)));
            return;
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    patchUser(pool,req,res,body) {

        // We do not allow patch on the collection itself
        if(req.route.path === "/api/users") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM users where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);
        var id = req.params.id;
        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            // If the array length is <= 0 then there is no user with the given ID
            if(replies.length > 0) {

                var user = replies[0];

                // Is there a better way??
                if(body.name) user.name = body.name;
                if(body.surname) user.surname = body.surname;
                if(body.student_id) user.student_id = body.student_id;
                if(body.email) user.email = body.email;
                if(body.skills) user.skills = body.skills;
                if(body.phone_number) user.phone_number = body.phone_number;
                if(body.username) user.username = body.username;
                if(body.password) user.password = body.password;
                if(body.bio) user.bio = body.bio;
                if(body.is_recruiter) user.is_recruiter = body.is_recruiter;
                if(body.secondaryskills) user.secondaryskills = body.secondaryskills;
                if(body.domain) user.domain = body.domain;

                // Propic Management
                var targetPath = default_path;
                // Only if we specified a propic to upload
                if(req.file) {
                    const tempPath = req.file.path;
                    const fileExt = path.extname(req.file.originalname).toLowerCase();
                    targetPath = path.join(__dirname, "../public/images/propics/" + user.id + fileExt);
        
                    // Moves the file from temp folder to propics folder with the correct name and extention
                    fs.rename(tempPath, targetPath, err => {
                        if(err) {
                            res.status(500).send(utils.errorHandler(500));
                            return;
                        }
                    });
                }

                var query = "UPDATE users SET name = ?, surname = ?, student_id = ?, email = ?, skills = ?, phone_number = ?, username = ?, password = ?, bio = ?, propic = ?, is_recruiter = ?, secondaryskills = ?, domain = ? WHERE id = ? ;";
                var inserts = [user.name, user.surname, user.student_id, user.email, user.skills, user.phone_number, user.username, user.password, user.bio, targetPath, user.is_recruiter, user.secondaryskills, user.domain, id];
                query = mysql.format(query,inserts);

                pool.query(query, function(err, replies) {
                    if(err) {
                        // If we are chaging to an already existing e mail address or username or phone number
                        if(err.errno == 1062) {
                            res.status(409).send(utils.errorHandler(409,err.sqlMessage));
                            console.log(err);
                            return;
                        }
                        res.status(500).send(utils.errorHandler(500));
                        console.log(err);
                        return;
                    }
                    
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("user", utils.formatResponse(replies)));
                    return;
                });
            }               
            else {
                res.status(404).send(utils.errorHandler(404));
                return; 
            }               
        });   
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    putUser(pool,req,res,body) {
        
        if(req.route.path === "/api/users") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM users where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        // Checking if the body is full (hence a valid PUT request)
        if(!req.file || !body.name || !body.surname || !body.student_id || !body.email || !body.skills || !body.phone_number || !body.username || !body.password || !body.bio || !body.is_recruiter || !body.domain) {

            res.status(400).send(utils.errorHandler(400));
            return;
        }

        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length > 0) {


                // Propic Management
                var targetPath = default_path;
                // Only if we specified a propic to upload
                if(req.file) {
                    const tempPath = req.file.path;
                    const fileExt = path.extname(req.file.originalname).toLowerCase();
                    targetPath = path.join(__dirname, "../public/images/propics/" + replies[0].id + fileExt);
        
                    // Moves the file from temp folder to propics folder with the correct name and extention
                    fs.rename(tempPath, targetPath, err => {
                        if(err) {
                            res.status(500).send(utils.errorHandler(500));
                            return;
                        }
                    });
                }

                var query = "UPDATE users SET name = ?, surname = ?, student_id = ?, email = ?, skills = ?, phone_number = ?, username = ?, password = ?, bio = ?, propic = ?, is_recruiter = ?,  domain = ? WHERE id = ? ;";
                var inserts = [body.name, body.surname, body.student_id, body.email, body.skills, body.phone_number, body.username, body.password, body.bio, targetPath, body.is_recruiter, body.domain, req.params.id];
                query = mysql.format(query,inserts);
        
                pool.query(query, function(err, replies) {
                    if(err) {

                        if(err.errno == 1062) {
                            res.status(409).send(utils.errorHandler(409,err.sqlMessage));
                            console.log(err);
                            return;
                        }

                        res.status(500).send(utils.errorHandler(500));
                        console.log(err);
                        return;
                    }
            
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("user", utils.formatResponse(replies)));
                    return;
                });
            } 
            else {
                res.status(404).send(utils.errorHandler(404));
            }
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    deleteUser(pool,req,res) {

        // We do not allow to delete the whole collection
        if(req.route.path === "/api/users") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "DELETE FROM users WHERE id = ? ;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function(err,replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                console.log(err);
                return;
            }

            // There is no user at the given ID
            if(replies.affectedRows <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }
            
            const file_path = path.join(__dirname, "../public/images/propics/" + req.params.id + ".png");
            
            fs.unlink(file_path, err => {
                if(err) {
                    console.log(err);
                }
            });

            res.status(204).send();
            return;
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getPropic(pool, req, res) {

        if(req.route.path === "/api/users/avatar") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "SELECT propic FROM users WHERE id = ? ;"
        var inserts = [req.params.id];
        query = mysql.format(query, inserts);

        pool.query(query, function(err, replies) {
            if(err) {
                console.log(err);
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no user with the given ID
            if(replies.length > 0) {
                
                // If someone hard-deleted propic from DB and left it NULL
                if(replies[0].propic == null) {
                    res.type("image/png").sendFile(default_path);
                    return;
                } 
                const path = replies[0].propic;
            
                res.status(200).type("image/png").sendFile(path);
                return;
            }
            else {
                res.status(404).send(utils.errorHandler(404));
                return;
            }
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    deleteUserPropic(pool,req,res) {

        // We do not allow to delete the whole collection
        if(req.route.path === "/api/users/avatar") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "UPDATE users SET propic = ? WHERE id = ? ;";
        var inserts = [default_path, req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function(err,replies) {
            //utils.errorHandler(406)
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            // There is no user at the given ID
            if(replies.affectedRows <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }

            const file_path = path.join(__dirname, "../public/images/propics/" + req.params.id + ".png");

            fs.unlink(file_path, err => {
                if(err) {
                    console.log(err);
                }
            });


            res.status(204).send();
            return;
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getDefaultSkills(pool,req,res) {

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT standard_skill_id FROM usr_skills WHERE user_id = ?; ";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function(err, replies) {
            
            if(err) {
                console.log(err);
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length > 0) {
                if(preferredheader == "application/json")
                    res.status(200).json(utils.formatResponse(replies));
                else
                    res.type("application/xml").status(200).send(xmlparser.parse("job", utils.formatResponse(replies)));
                return;
            }
            else {
                res.status(404).send(utils.errorHandler(404));
                return;
            }
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    addDefaultSkills(pool,req,res,body) {

        var bodyskills = body.skills;

        var query = '';
        bodyskills.forEach(skill => {

            var partial_query = "INSERT INTO usr_skills(user_id, standard_skill_id) VALUES (?,?); ";
            var inserts = [req.params.id, skill];
            partial_query = mysql.format(partial_query,inserts);

            query = query + partial_query;

        })
        
        pool.query(query, function(err,replies) {
            
            if(err) {
                if(err.errno == 1062) {
                    res.status(409).send(utils.errorHandler(409,err.sqlMessage));
                    return;
                }

                if(err.errno == 1452) {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                }

                console.log(err);
                res.status(500).send(utils.errorHandler(500,err.sqlMessage));
                return;
            }

            if(replies.length > 0) {
                res.status(204).send();
                return;
            } 
            return;
        });      
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    putDefaultSkills(pool,req,res,body) {

        res.status(405).send(utils.errorHandler(405));
        return;
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    patchDefaultSkills(pool,req,res,body) {

        res.status(405).send(utils.errorHandler(405));
        return;
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    deleteDefaultSkills(pool,req,res,body) {

        var bodyskills = body.skills;
        var query = '';

        query = "SELECT id FROM users WHERE id = ? ;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);
        
        pool.query(query, function(err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }
            query = '';
            bodyskills.forEach(skill => {

                var partial_query = "DELETE FROM usr_skills WHERE user_id = ? AND standard_skill_id = ?; ";
                inserts = [req.params.id, skill];
                partial_query = mysql.format(partial_query,inserts);
    
                query = query + partial_query;
    
            });
    
            pool.query(query, function(err,replies) {
    
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }
    
                res.status(204).send();
                return;
            });
        });        
    }
}