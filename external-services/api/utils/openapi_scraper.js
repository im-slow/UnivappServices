// HOW TO CHECK EXEC TIME AND LOGS: 
//     time node openapi_scraper.js > log.txt 2> error_log.txt

const mysql = require("mysql");
const request = require("request");

const pool = mysql.createPool({
    connectionLimit: 20,
    host: "localhost",
    user: "root",
    password: "",
    database: "ingsw"
});

// The higher the number, the faster the process, MIN = 1 MAX = 500
const N = 100

console.log("Caching skills...");
next(0);


// Recursive function, retrieves N skills from the API for each recursive call, 
// then calls the storeData function with the retrived set of data
function next(i) {
    request("http://api.dataatwork.org/v1/skills?offset=" + i + "&limit=" + N, {json: true}, (err,res,body) => {
        
        if(err) return console.error(err);
        if(!body || res.statusCode != 200) return;
        storeData(body, 0);
        next(i + N);
    });
}

// Recursive function, stores N skills in the local MySQL instance
function storeData(body, index) {

    if(index >= N) return;
    var query = "INSERT INTO standard_skills(name,type,description,normalized_skill_name) VALUES(?,?,?,?);";
    var inserts = [body[index].name, body[index].type, body[index].description, body[index].normalized_skill_name];
    query = mysql.format(query,inserts);


    pool.query(query, (err, res) => {

        if(err) console.error(err);
        console.log(res);
    });

    storeData(body, index + 1);    
}

