const mysql = require("mysql");
const xmlparser = require("js2xmlparser");
const utils = require("./controller_utils");

module.exports = {
    

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getJobsData(pool, req, res) {
        
        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM jobs WHERE id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function (err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            
            if(replies.length <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }

            query = "SELECT user_id FROM usr_jobs WHERE job_id = ?";
            inserts = [replies[0].id];
            query = mysql.format(query,inserts);
            
            pool.query(query, function(err, rep) {
                if(err) {
                    console.log(err);
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                // If the array length is <= 0 then there is no job with the given ID
                if(replies.length > 0) {
                    // If the job was hard-inserted into the db and has no user associated
                    if(rep.length <= 0) {
                        replies[0].user_id = 0;
                    } else
                        replies[0].user_id = rep[0].user_id;
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
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getJobsList(pool, req, res) {

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


        // First we count the number of jobs
        pool.query("SELECT COUNT(*) as jobs_number FROM jobs;", function(err, replies){
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            if(replies.length <= 0) {
                res.status(204).send();
                return;
            }

            metaWrapper.total_elements = replies[0].jobs_number;

            var jobs_number = parseInt(replies[0].jobs_number);            
            var page = parseInt(req.query.p);
            var pageLength = parseInt(req.query.pl);

            if(!pageLength) pageLength = 25;
            if(!page) page = 1;

            var offset = pageLength * page - pageLength; // Quick maths BTW

            // If the offset is too big we put the offset to the last page but we keep the page length
            if(offset >= jobs_number) {
                offset = jobs_number - pageLength;
                metaWrapper.page_number = Math.floor(jobs_number / pageLength);
            }
            if(offset < 0) offset = 0;

            this.query = "SELECT * FROM jobs ORDER BY id ASC LIMIT " + offset + "," + pageLength + ";";
        
            pool.query(this.query, function (err, replies){
                if(err) {
                    console.log(err);
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                query = "SELECT * FROM usr_jobs ORDER BY job_id ASC";
                
                pool.query(query, function(err, rep) {
                    if(err) {
                        console.log(err);
                        res.status(500).send(utils.errorHandler(500));
                        return;
                    }
                    

                    // If the array length is <= 0 then there is no job
                    if(replies.length > 0) {
                        var i = 0;
                        replies.forEach(job => {
                            job.user_id = rep[i].user_id;
                            i++;
                        });

                        if(preferredheader == "application/json")
                            res.status(200).json(utils.formatResponse(replies, undefined, metaWrapper));
                        else
                            res.type("application/xml").status(200).send(xmlparser.parse("job", utils.formatResponse(replies, undefined, metaWrapper)));
                        return;
                    }
                    else {
                        res.status(404).send(utils.errorHandler(404));
                        return;
                    }

                });                
            });
        });       
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    createJob(pool, req, res, body) {
        
        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "INSERT INTO jobs(name,descr,high_prio_skills,medium_prio_skills,low_prio_skills,domain) VALUES(?,?,?,?,?,?);";
        var inserts = [body.name, body.descr, body.high_prio_skills, body.medium_prio_skills, body.low_prio_skills, body.domain];
        query = mysql.format(query,inserts);
        
        pool.query(query, function(err, replies) {
            if(err) {      
                console.log(err);          
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            
            query = "INSERT INTO usr_jobs(user_id, job_id) VALUES(?,?);";
            inserts = [body.user_id, replies.insertId];
            query = mysql.format(query,inserts);
            
            pool.query(query, function(err, rep) {
                if(err) {             
                    console.log(err);   
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                // We attach the link to the new resource to the response
                replies.resource = "/api/jobs/" + replies.insertId;
                if(preferredheader == "application/json")
                    res.status(201).json(utils.formatResponse(replies));
                else
                    res.type("application/xml").status(201).send(xmlparser.parse("job", utils.formatResponse(replies)));
                return;
            });           
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    patchJob(pool,req,res,body) {

        if(req.route.path === "/api/jobs") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM jobs where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);
        var id = req.params.id;
        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no job with the given ID
            if(replies.length > 0) {

                var job = replies[0];
                // Is there a better way??
                if(body.name) job.name = body.name;
                if(body.descr) job.descr = body.descr;
                if(body.high_prio_skills) job.high_prio_skills = body.high_prio_skills;
                if(body.medium_prio_skills) job.medium_prio_skills = body.medium_prio_skills;
                if(body.low_prio_skills) job.low_prio_skills = body.low_prio_skills;
                if(body.domain) job.domain = body.domain;
                

                var query = "UPDATE jobs SET name = ?, descr = ?, high_prio_skills = ?, medium_prio_skills = ?, low_prio_skills = ?, domain = ? WHERE id = ? ;";
                var inserts = [job.name, job.descr, job.high_prio_skills, job.medium_prio_skills, job.low_prio_skills, job.domain, id];
                query = mysql.format(query,inserts);

                pool.query(query, function(err, replies) {
                    if(err) {
                        res.status(500).send(utils.errorHandler(500));
                        return;
                    }
                    
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("job", utils.formatResponse(replies)));
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
    putJob(pool,req,res,body) {
        
        if(req.route.path === "/api/jobs") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM jobs where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        // Checking if the body is full (hence a valid PUT request)
        if(!body.name || !body.descr || !body.high_prio_skills || !body.medium_prio_skills || !body.low_prio_skills || !body.domain) {

            res.status(400).send(utils.errorHandler(400));
            return;
        }

        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length > 0) {

                var query = "UPDATE jobs SET name = ?, descr = ?, high_prio_skills = ?, medium_prio_skills = ?, low_prio_skills = ?, domain = ? WHERE id = ? ;";
                var inserts = [body.name, body.descr, body.high_prio_skills, body.medium_prio_skills, body.low_prio_skills, body.domain, req.params.id];
                query = mysql.format(query,inserts);
        
                pool.query(query, function(err, replies) {
                    if(err) {
                        res.status(500).send(utils.errorHandler(500));
                        console.log(err);
                        return;
                    }
            
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("job", utils.formatResponse(replies)));
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
    * @param {String} body The parsed body from the POST request
    */
    deleteJob(pool,req,res) {

        if(req.route.path === "/api/jobs") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "DELETE FROM jobs WHERE id = ? ;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function(err,replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.affectedRows <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }

            query = "DELETE FROM usr_jobs WHERE job_id = ?;";
            query = mysql.format(query,inserts);

            pool.query(query, function(err, rep) {
                if(err) {
                    console.log(err);
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                res.status(204).send();
                return;
            })            
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

        var query = "SELECT standard_skill_id FROM jobs_skills WHERE job_id = ?; ";
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

            var partial_query = "INSERT INTO jobs_skills(job_id, standard_skill_id) VALUES (?,?); ";
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
                res.status(500).send(utils.errorHandler(500));
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
        bodyskills.forEach(skill => {

            var partial_query = "DELETE FROM jobs_skills WHERE job_id = ? AND standard_skill_id = ?; ";
            var inserts = [req.params.id, skill];
            partial_query = mysql.format(partial_query,inserts);

            query = query + partial_query;

        });

        pool.query(query, function(err,replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.affectedRows <= 0) {
                res.status(404).send(utils.errorHandler(404));
                return;
            }

            res.status(204).send();
            return;
        });
    }
}