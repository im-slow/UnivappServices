// Before runnign this script, be sure to increase the max_allowed_packet variable
// in my.ini to at least 50M

const mysql = require("../api/node_modules/mysql");

const conn = mysql.createConnection({
        multipleStatements: true,
        host: "localhost",
        user: "root",
        password: "root",
        database: "jobDB"
})

conn.connect(function(err) {
    console.log("Connected");

    var i = 1, j = 10;

    var query = "INSERT INTO jobs(name,descr,high_prio_skills,medium_prio_skills,low_prio_skills,domain) VALUES(?,?,?,?,?,?); ";
    var skills_query = "INSERT INTO jobs_skills(job_id, standard_skill_id) VALUES(?,?); "
    var full_query = '';
    var full_skills_query = '';
    var inserts = [];
    while(i < 10000) {

        inserts = [i,i,5,5,5,1];
        let temp_query = mysql.format(query,inserts);
        full_query += temp_query;

        j = 10;
        full_skills_query = '';
        while(j < 21) {
            inserts = [i,j];
            let temp_query = mysql.format(skills_query, inserts);
            full_skills_query += temp_query;
            j++;
        }
        full_query += full_skills_query;
        i++;
    }
    
    //console.log(full_query);

    conn.query(full_query, function(err, res) {
        if(err) console.error(err);
        //console.log(res);
        console.log("Done generating " + i + " jobs");
        process.exit(0);
    })

    
})