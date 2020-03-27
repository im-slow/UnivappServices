const mysql = require("mysql");
const utils = require("./controller_utils");

module.exports = {
    
    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    */
    getDomainData(pool, req, res) {
        

        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM domains where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        pool.query(query, function (err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no Domain with the given ID
            if(replies.length > 0) {
                if(preferredheader == "application/json")
                    res.status(200).json(utils.formatResponse(replies));
                else
                    res.type("application/xml").status(200).send(xmlparser.parse("job",utils.formatResponse(replies)));
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
    getDomainsList(pool, req, res) {

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

        // First we count the number of domains
        pool.query("SELECT COUNT(*) as domains_number FROM domains;", function(err, replies){
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            if(replies.length <= 0) {
                res.status(204).send();
                return;
            }

            metaWrapper.total_elements = replies[0].domains_number;
           
            var domains_number = parseInt(replies[0].domains_number);            
            var page = parseInt(req.query.p);
            var pageLength = parseInt(req.query.pl);

            if(!pageLength) pageLength = 25;
            if(!page) page = 1;

            var offset = pageLength * page - pageLength; // Quick maths BTW

            // If the offset is too big we put the offset to the last page but we keep the page length
            if(offset >= domains_number) {
                offset = domains_number - pageLength;
                metaWrapper.page_number = Math.floor(domains_number / pageLength);
            }
            if(offset < 0) offset = 0;

            this.query = "SELECT * FROM domains LIMIT " + offset + "," + pageLength + ";";
        
            pool.query(this.query, function (err, replies){
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }
                // If the array length is <= 0 then there is no domain
                if(replies.length > 0) {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies, undefined, metaWrapper));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("domain", utils.formatResponse(replies, undefined, metaWrapper)));
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
    createDomain(pool, req, res, body) {
        
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "INSERT INTO domains(name) VALUES(?);";
        var inserts = [body.name];
        query = mysql.format(query,inserts);
        
        pool.query(query, function(err, replies) {
            if(err) {
                res.status(500).send(utils.errorHandler(500));
                console.log(err);
                return;
            }
            
            // We attach the link to the new resource to the response
            replies.resource = "/api/domains/" + replies.insertId;
            if(preferredheader == "application/json")
                res.status(201).json(replies);
            else
                res.type("application/xml").status(201).send(xmlparser.parse("domain", replies));
            return;
        });
    },

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    */
    patchDomain(pool,req,res,body) {

        if(req.route.path === "/api/domains") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM domains where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);
        var id = req.params.id;
        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }
            // If the array length is <= 0 then there is no Domain with the given ID
            if(replies.length > 0) {

                var domain = replies[0];
                // Is there a better way??
                if(body.name) domain.name = body.name;
                

                var query = "UPDATE domains SET name = ? WHERE id = ? ;";
                var inserts = [domain.name, id];
                query = mysql.format(query,inserts);

                pool.query(query, function(err, replies) {
                    if(err) {
                        res.status(500).send(utils.errorHandler(500));
                        return;
                    }
                    
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("domain", utils.formatResponse(replies)));
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
    putDomain(pool,req,res,body) {
        
        if(req.route.path === "/api/domains") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        var query = "SELECT * FROM domains where id = ?;";
        var inserts = [req.params.id];
        query = mysql.format(query,inserts);

        // Checking if the body is full (hence a valid PUT request)
        if(!body.name){

            res.status(400).send(utils.errorHandler(400));
            return;
        }

        pool.query(query, function (err, replies) {

            if(err) {
                res.status(500).send(utils.errorHandler(500));
                return;
            }

            if(replies.length > 0) {

                var query = "UPDATE domains SET name = ? WHERE id = ? ;";
                var inserts = [body.name, req.params.id];
                query = mysql.format(query,inserts);
        
                pool.query(query, function(err, replies) {
                    if(err) {
                        res.status(500).send(utils.errorHandler(500));
                        return;
                    }
            
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("domain", utils.formatResponse(replies)));
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
    deleteDomain(pool,req,res) {

        if(req.route.path === "/api/domains") {
            res.status(405).send(utils.errorHandler(405));
            return;
        }

        var query = "DELETE FROM domains WHERE id = ? ;";
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