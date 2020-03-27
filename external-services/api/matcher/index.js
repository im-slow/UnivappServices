const mysql = require('mysql');
const cache = require('../cacher');
const binary = require('binary-search');

module.exports = {

    // Match a user with all jobs in the same domain of interest
    matchUserJobsRaw(user_id, pool, forced, callback) {

        // Getting all the non obsolete matches so i won't recalculate them
        cache.getNonObsoleteMatches(user_id, "raw", function(err, non_obsolete) {
            if(err) 
                return err;

            // Getting the user domain of interest
            var query = "SELECT domain FROM users WHERE id = ?;";
            var inserts = [user_id];
            query = mysql.format(query, inserts);
            pool.query(query, function(err, user) {

                if(err) 
                    if(typeof callback == "function")
                        callback(err,undefined);
                if(user.length <= 0) {
                    if(typeof callback == "function") {
                        callback(err,undefined);
                        return;
                    }
                }  
                var domain = user[0].domain;

                query = "SELECT * FROM jobs WHERE domain = ?;";
                inserts = [domain];
                query = mysql.format(query, inserts);
                // Getting all the jobs with the same domain of interest as the user's
                pool.query(query, function (err, job_replies) {

                    if(err) 
                        if(typeof callback == "function") {
                            callback(err,undefined);
                            return;
                        }
                    // If we are allowed to use cache
                    // Removing from the queue of matches the cached ones that are not obsolete
                    if(!forced && non_obsolete.length > 0) {
                        job_replies = job_replies.filter(job => {
                            return !non_obsolete.includes(""+job.id);                   
                        });
                    }
                    
                    if(job_replies.length > 0) {

                        query = "SELECT standard_skill_id FROM usr_skills WHERE user_id = ? ORDER BY standard_skill_id ASC";
                        var inserts = [user_id];
                        query = mysql.format(query, inserts);

                        // Getting all the user skills
                        pool.query(query, function(err, user_skills) {

                            if(err) 
                                if(typeof callback == "function") {
                                        callback(err, undefined);
                                        return;
                                    }
                            query = '';
                            
                            job_replies.forEach(job => {
                                query = query + "SELECT job_id, standard_skill_id AS skill_id FROM jobs_skills WHERE job_id = " + job.id + "; ";
                            });
                            
                           
                            // Getting all the skills for each job that matches the user's domain of interest
                            pool.query(query, function(err, job_skills) {

                                if(err) 
                                    if(typeof callback == "function") {
                                        callback(err, undefined);
                                        return;
                                    }

                                // Parsing the user skills into an array so we can binary-search it
                                var parsed_skills = [];
                                user_skills.forEach(skill => {
                                    parsed_skills.push(skill.standard_skill_id);
                                });

                                var temp = [];
                                if(job_replies.length == 1) {
                                    temp[0] = [...job_skills];
                                    job_skills = temp;
                                }

                                var results = [];
                                var counter = 0;
                                // Foreach job X 
                                job_skills.forEach(job => {
                                    if(job.length <= 0)
                                        return;
                                    counter = 0;            
                                    
                                    
                                    // Foreach skill Y in X we binary search the user's skill array for Y if it exists we count it.
                                    job.forEach(skill => {      
                                                               
                                        if(parsed_skills.includes(skill.skill_id)) 
                                            counter++;
                                                                               
                                    });
                                    
                                    var template = {
                                        user_id: user_id,
                                        job_id: job[0].job_id,
                                        match_percentage: Math.round(counter / job.length * 100)
                                    };
                                
                                    results.push(template);
                                });

                                // Caching and returning.
                                cache.storeRawScore(results, function(res) {
                                    if(res) {
                                
                                        cache.getMatches(user_id, "raw", function(err, res) {
                                            if(typeof callback == "function")
                                                callback(undefined, res);
                                        });
                                    }                                
                                });
                            });
                        });
                    } else {
                        cache.getMatches(user_id, "raw", function(err, res) {
                            if(typeof callback == "function")
                                callback(undefined, res);
                        });
                    }
                });
            });        
        });        
    },

    // CACHELESS ONLY!!!
    // Matching one job with all the users with the same domain of interest
    matchJobUsersRaw(job_id, pool, callback) {

        // Getting the job domain of interest
        var query = "SELECT domain FROM jobs WHERE id = ?;";
        var inserts = [job_id];
        query = mysql.format(query, inserts);

        pool.query(query, function(err, job) {

            if(err) 
                if(typeof callback == "function") {
                    callback(err,undefined);
                    return;
                }

            if(job.length <= 0) {
                if(typeof callback == "function") {
                    callback(err,undefined);
                    return;
                }
            }
            
            var domain = job[0].domain;

            query = "SELECT id FROM users WHERE domain = ?;";
            inserts = [domain];
            query = mysql.format(query, inserts);

            // Getting all the users with the same domain of interest as the job's
            pool.query(query, function (err, user_replies) {

                if(err) 
                    if(typeof callback == "function") {
                        callback(err,undefined);
                        return;
                    }

                query = "SELECT standard_skill_id FROM jobs_skills WHERE job_id = ? ORDER BY standard_skill_id ASC";
                var inserts = [job_id];
                query = mysql.format(query, inserts);

                // Getting all the job skills
                pool.query(query, function(err, job_skills) {

                    if(err) 
                        if(typeof callback == "function") {
                            callback(err,undefined);
                            return;
                        }

                    query = '';
 
                    user_replies.forEach(user => {
                        query = query + "SELECT user_id, standard_skill_id AS skill_id FROM usr_skills WHERE user_id = " + user.id + "; ";
                    });
                    
                    // Getting all the skills for each user that matches the job's domain of interest
                    pool.query(query, function(err, user_skills) {

                        if(err) 
                            if(typeof callback == "function") {
                                callback(err,undefined);
                                return;
                            }
                        
                        // Parsing the job skills into an array so we can binary-search it
                        var parsed_skills = [];
                        job_skills.forEach(skill => {
                            parsed_skills.push(skill.standard_skill_id);
                        });

                        var results = [];
                        var counter = 0;

                        // Foreach user X 
                        user_skills.forEach(user => {
                            
                            // Checking if the user has at least one skill.
                            if(!user[0])
                                return;

                            counter = 0;                         

                            // Foreach skill Y in X we binary search the job's skill array for Y if it exists we count it.
                            user.forEach(skill => {                               
                                if(parsed_skills.includes(skill.skill_id)) 
                                    counter++;
                            });

                            let template = {
                                user_id: user[0].user_id,
                                job_id: job_id,
                                match_percentage: Math.round(counter / parsed_skills.length * 100)
                            };

                            results.push(template);                        
                        });
                        
                        // Caching and returning.
                        
                        if(typeof callback == "function")
                            callback(undefined,results);

                        cache.storeRawScore(results, function(res) {
                            return res;
                        });
                    });
                });
            });
        });
    },


    
    matchJobUserRaw(user_id, job_id, pool, forced, callback) {


        cache.getMatch(user_id, job_id, "raw", function(err, res) {

            if(!forced)
            {
                if(err)
                    if(typeof callback == "function"){
                        callback(err, undefined);
                        return;
                    }
                if(res) {
                    if(typeof callback == "function") {
                        callback(undefined, [JSON.parse(res)]);
                        return;
                    }
                }
            }
            
            var query = "SELECT standard_skill_id FROM usr_skills WHERE user_id = ? ORDER BY standard_skill_id ASC";
            var inserts = [user_id];
            query = mysql.format(query, inserts);

            pool.query(query, function(err, user_skills) {

                if(err) 
                    if(typeof callback == "function") {
                        callback(err, undefined);
                        return;
                    }

                var query = "SELECT standard_skill_id as skill_id FROM jobs_skills WHERE job_id = ? ORDER BY standard_skill_id ASC";
                var inserts = [job_id];
                query = mysql.format(query, inserts);

                var parsed_skills = [];
                user_skills.forEach(skill => {
                    parsed_skills.push(skill.standard_skill_id);
                });

                var counter = 0;
                pool.query(query, function(err, job_skills) {

                    if(err) 
                        if(typeof callback == "function") {
                            callback(err, undefined);
                            return;
                        }

                    job_skills.forEach(skill => {

                        if(parsed_skills.includes(skill.skill_id)) 
                            counter++;
                    });
                    
                    let template = {
                        user_id: user_id,
                        job_id: job_id,
                        match_percentage: counter / job_skills.length * 100
                    };
                    
                    if(typeof callback == "function")
                        callback(undefined, [template]);

                    cache.storeRawScore([template]);
                });
            });            
        });      
    },


    // Match dettagliati di un job con un utente
    matchRefined(user_id, job_id, numbers, pool, forced, cacheonly, callback) {
        const high = 10, medium = 6, low = 2, standard = ( high + medium ) / 2;
        
        cache.getMatch(user_id, job_id, "refined", function(err, res) {
            if(forced == 'false') {
                if(err)
                    if(typeof callback == "function"){
                        callback(err, undefined);
                        return;
                    }

                if(!res && cacheonly == 'true') {
                    if(typeof callback == "function") {
                        callback(undefined, []);
                        return;
                    }
                }
                    
                if(res) {
                    res = JSON.parse(res);
                    if(!res.obsolete)
                        if(typeof callback == "function") {
                            callback(undefined, [res]);
                            return;
                        }
                }
            }
            

            matchJobUserRawPrivate(user_id, job_id, pool, function(err,res) {
                if(err)
                    if(typeof callback == "function") {
                        callback(err, undefined);
                        return;
                    }   

                if(res.length <= 0) {
                    if(typeof callback == "function"){
                        callback(undefined, []);
                        return;
                    }
                }

                var tot = numbers.max_high * high + numbers.max_medium * medium + numbers.max_low * low + res.max_standard * standard;
                var tot_unit = numbers.selected_high * high + numbers.selected_medium * medium + numbers.selected_low * low + res.selected_standard * standard;
                
                let template = {
                    user_id: user_id,
                    job_id: job_id,
                    match_percentage: Math.round(tot_unit / tot * 100),
                    obsolete: false
                }
                if(typeof callback == "function") 
                    callback(undefined, [template]);
                
                cache.storeRefinedScore([template]);
                
            });      
        });   
    },

    makeObsolete(user_id, job_id, type, callback) {
        cache.deprecateScore(user_id, job_id, type, function(err, res) {
            if(err) 
                if(typeof callback == "function") {
                    callback(err, undefined);
                    return;
                }
            
            if(res.length <= 0) {
                if(typeof callback == "function") {
                    callback(undefined, []);
                    return;
                }
            }

            if(typeof callback == "function") {
                callback(undefined, true);
                return;
            }
        })
    }
}


function matchJobUserRawPrivate(user_id, job_id, pool, callback) {

    query = "SELECT standard_skill_id FROM usr_skills WHERE user_id = ? ORDER BY standard_skill_id ASC";
    inserts = [user_id];
    query = mysql.format(query, inserts);

    pool.query(query, function(err, user_skills) {

        if(err) 
            if(typeof callback == "function") {
                callback(err, undefined);
                return;
            }   

        if(user_skills.length <= 0) {
            if(typeof callback == "function") {
                callback(undefined, []);
                return;
            }
        }

        var query = "SELECT standard_skill_id as skill_id FROM jobs_skills WHERE job_id = ? ORDER BY standard_skill_id ASC";
        var inserts = [job_id];
        query = mysql.format(query, inserts);

        var parsed_skills = [];
        user_skills.forEach(skill => {
            parsed_skills.push(skill.standard_skill_id);
        });

        var counter = 0;
        pool.query(query, function(err, job_skills) {

            if(err) 
                if(typeof callback == "function") {
                    callback(err,undefined);
                    return;
                }
            
            if(job_skills.length <= 0) {
                if(typeof callback == "function") {
                    callback(undefined, []);
                    return;
                }
            }
            job_skills.forEach(skill => {

                if(parsed_skills.includes(skill.skill_id)) 
                    counter++;
            });

            if(typeof callback == "function")
                callback(undefined, { selected_standard: counter, max_standard: job_skills.length});
        });
    });
};