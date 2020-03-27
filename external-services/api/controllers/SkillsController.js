const mysql = require("mysql");
const utils = require("./controller_utils");

module.exports = {
    
    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getSkillData(pool, req, res) {
        

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM skills where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function (err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no skill with the given ID
            if(replies.length > 0) {
                if(preferredheader == "application/json")
                    res.status(200).json(utils.formatResponse(replies));
                else
                    res.type("application/xml").status(200).send(xmlparser.parse("skill", utils.formatResponse(replies)));
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
    getSkillsList(pool, req, res) {

        var metaWrapper = {
            page_number: req.params.p,
            page_length: req.query.pl,
            total_elements: ''
        };

        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        // First we count the number of skills
        pool.query("SELECT COUNT(*) as skills_number FROM skills;", function(err, replies){
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            if(replies.length <= 0) {
                res.status(204).send();
                return;
            }

            metaWrapper.total_elements = replies[0].skills_number;
           
            var skills_number = parseInt(replies[0].skills_number);            
            var page = parseInt(req.query.p);
            var pageLength = parseInt(req.query.pl);

            if(!pageLength) pageLength = 25;
            if(!page) page = 1;

            var offset = pageLength * page - pageLength; // Quick maths BTW

            // If the offset is too big we put the offset to the last page but we keep the page length
            if(offset >= skills_number) {
                offset = skills_number - pageLength;
                metaWrapper.page_number = Math.floor(skills_number / pageLength);
            }
            if(offset < 0) offset = 0;

            this.query = "SELECT * FROM skills LIMIT " + offset + "," + pageLength + ";";
        
            pool.query(this.query, function (err, replies){
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }
                // If the array length is <= 0 then there is no skill
                if(replies.length > 0) {
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
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    createSkill(pool, req, res, body) {
        
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "INSERT INTO skills(name,type,description) VALUES(?,?,?);";
        var inserts = [body.name, body.type, body.description];
        query = mysql.format(query,inserts);
        
        pool.query(query, function(err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            
            // We attach the link to the new resource to the response
            replies.resource = "/api/skills/" + replies.insertId;
            if(preferredheader == "application/json")
                res.status(201).json(utils.formatResponse(replies));
            else
                res.type("application/xml").status(201).send(xmlparser.parse("job", utils.formatResponse(replies)));
            return;
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    patchSkill(pool,req,res,body) {

        if(req.route.path === "/api/skills") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM skills where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);
        var id = req.params.id;
        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no skill with the given ID
            if(replies.length > 0) {

                var skill = replies[0];
                // Is there a better way??
                if(body.name) skill.name = body.name;
                if(body.type) skill.type = body.type;
                if(body.description) skill.description = body.description;
                

                var query = "UPDATE skills SET name = ?, type = ?, description = ? WHERE id = ? ;";
                var inserts = [skill.name, skill.type, skill.description, id];
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
    putSkill(pool,req,res,body) {
        
        if(req.route.path === "/api/skills") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM skills where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        // Checking if the body is full (hence a valid PUT request)
        if(!body.name || !body.type || !body.description){

            res.status(400).send(utils.errorHandler(400));
            return;
        }

        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length > 0) {

                var query = "UPDATE skills SET name = ?, type = ?, description = ? WHERE id = ? ;";
                var inserts = [body.name, body.type, body.description, req.params.id];
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
            }
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    deleteSkill(pool,req,res) {

        if(req.route.path === "/api/skills") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "DELETE FROM skills WHERE id = ? ;";
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

            res.status(204).send();
            return;
        });
    }
}