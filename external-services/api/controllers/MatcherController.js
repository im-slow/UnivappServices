const matcher = require("../matcher");
const xmlparser = require("js2xmlparser");
const utils = require("./controller_utils");


module.exports = {

    /**
    * @param {Pool} pool A connection pool from where retrieve a connection
    * @param {Request} req The incoming request
    * @param {Response} res The response object
    * @param {String} body The parsed body from the POST request
    * @param {bool} forced True if we are forcing cacheless computation
    */
    newRawMatch(pool, req, res, body, forced) {
        
        
        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }

        if(body.user && body.job) {
            matcher.matchJobUserRaw(body.user, body.job, pool, forced, function(err, replies) {

                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                if(replies) {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("match", utils.formatResponse(replies)));
                    return;
                }
                else {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                } 
            });
        } else if(body.user) {
            matcher.matchUserJobsRaw(body.user, pool, forced, function(err , replies) {
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                if(replies) {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("match", utils.formatResponse(replies)));
                    return;
                }
                else {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                } 
            });
        } else if(body.job) {
            matcher.matchJobUsersRaw(body.job, pool, function(err , replies) {
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }

                if(replies) {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("match", utils.formatResponse(replies)));
                    return;
                }
                else {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                } 
            });
        }
    },


    newRefinedMatch(pool, req, res, body, forced) {
        
        
        //Checking the accept headers of the request to check if it is supported by our system, application/json is always preferred
        const preferredheader = utils.checkPreferredHeader(req.header('Accept'));
        if(!preferredheader) {
            res.status(406).send(utils.errorHandler(406));
            return;
        }


        if(body.user && body.job && body.max_high && body.max_medium && body.max_low) {

            if(!body.selected_max) body.selected_max = 0;
            if(!body.selected_medium) body.selected_medium = 0;
            if(!body.selected_low) body.selected_low = 0;

            let numbers = {
                max_high: body.max_high,
                max_medium: body.max_medium,
                max_low: body.max_low,
                selected_high: body.selected_high,
                selected_medium: body.selected_medium,
                selected_low: body.selected_low
            };

            matcher.matchRefined(body.user, body.job, numbers, pool, forced, req.query['cacheonly'], function(err , replies) {
                if(err) {
                    res.status(500).send(utils.errorHandler(500));
                    return;
                }
                if(replies.length > 0 || req.query['cacheonly'] == 'true') {
                    if(preferredheader == "application/json")
                        res.status(200).json(utils.formatResponse(replies));
                    else
                        res.type("application/xml").status(200).send(xmlparser.parse("match", utils.formatResponse(replies)));
                    return;
                }
                else {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                } 
            })
        } else {
            res.status(400).send(utils.errorHandler(400));
            return;
        }
    },

    makeObsolete(req, res, body, type) {

        if(body.user && body.job) {
            matcher.makeObsolete(body.user, body.job, type, function(err, response) {
                if(err) {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                }

                if(response.length <= 0) {
                    res.status(404).send(utils.errorHandler(404));
                    return;
                }

                res.status(204).send();
                return;
            });
        } else {
            res.status(400).send(utils.errorHandler(400));
            return;
        }
    }
}