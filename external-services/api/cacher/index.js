const redis = require("redis"), client = redis.createClient();
const quicksort = require('optimized-quicksort');

const a_raw = "_raw";
const a_refined = "_ref";

module.exports = {

    // Salva il punteggio calcolato dalla skill default
    storeRawScore(score_list, callback) {

        if(!score_list) 
            return;

        score_list.forEach(element => {
            //console.log("Storing: "), console.log(element);
            element.obsolete = false;
            client.hset(element.user_id + a_raw, element.job_id, JSON.stringify(element));
        });

        if(typeof callback == "function") {
            callback(true);
        }
    },
    // Salva il punteggio calcolate da skill di default + skill secondarie
    storeRefinedScore(score_list, callback) {
        
        if(!score_list)
            return;
        
            score_list.forEach(element => {
                element.obsolete = false;
                client.hset(element.user_id + a_refined, element.job_id, JSON.stringify(element));   
            });
        
        if(typeof callback == "function") {
            callback(true);
        }
    },

    // Preleva il punteggio calcolato dalle skill di default
    getMatches(user_id, type, callback) {

        if(type == "raw") 
            type = a_raw
        else
            type = a_refined

        client.hgetall(user_id + type, function(err,res) {
            if(err)
                if(typeof callback == "function") {
                    callback(err, undefined);
                    return;
                }

            var results = [];
            Object.values(res).forEach(match => {
                results.push(JSON.parse(match));
            });

            if(typeof callback == "function") {
                callback(undefined, results);
                return;
            }
        })
    },

    getMatch(user_id, job_id, type, callback) {
        
        if(!user_id || !job_id) 
            if(typeof callback == "function") {
                callback("No user ID or job ID", undefined);
                return;
            }

        if(!type || (type != "raw" && type != "refined"))
            if(typeof callback == "function") {
                callback("Wrong type", undefined);
                return;
            }

        if(type == "raw") 
            type = a_raw
        else
            type = a_refined

        client.hget(user_id + type, job_id, function(err, res) {

            if(err)
                if(typeof callback == "function") {
                    callback("Cache error", undefined);
                    return; 
                }

            if(typeof callback == "function") {
                callback(undefined, res);
                return; 
            }
        });
    },

    getNonObsoleteMatches(user_id, type, callback) {{
        if(!user_id)
            if(typeof callback == "function") {
                callback("No user ID", undefined);
                return;
            }
                
        
        if(!type || (type != "raw" && type != "refined"))
            if(typeof callback == "function") {
                callback("Wrong type", undefined);
                return;
            }
        
        if(type == "raw") 
            type = a_raw
        else
            type = a_refined

        client.hgetall(user_id + type, function(err, res) {
            if(err)
                if(typeof callback == "function") {
                    callback("Cache error", undefined);
                    return;
            }
            if(!res) 
                if(typeof callback == "function") {
                    callback(undefined, []);
                    return;
                }

            var results = [];
            Object.keys(res).forEach(job => {
                if(!JSON.parse(res[job]).obsolete)
                    results.push(job);
            });

            quicksort.sort(results, compare);

            if(typeof callback == "function") {
                callback(undefined, results);
                return;
            }
        });        
    }},

    // Setta un punteggio a deprecato
    deprecateScore(user_id, job_id, type, callback) {
        
        if(!user_id || !job_id) 
            if(typeof callback == "function") {
                callback("No user ID or job ID", undefined);
                return;
            }

        if(!type || (type != "raw" && type != "refined"))
            if(typeof callback == "function") {
                callback("Wrong type", undefined);
                return;
            }

        if(type == "raw") 
            type = a_raw
        else
            type = a_refined

        client.hget(user_id + type, job_id, function(err, res) {

            if(err)
                if(typeof callback == "function") {
                    callback("Cache error", undefined);
                    return; 
                }
            
            if(!res) {
                if(typeof callback == "function") {
                    callback(undefined, []);
                    return; 
                }
            }
            
            var job = JSON.parse(res);
            job.obsolete = true;

            client.hset(user_id + type, job_id, JSON.stringify(job));
            if(typeof callback == "function") {
                callback(undefined, true);
                return;
            }
        });
    },

}

// Used for quicksort
function compare(a, b) {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
}