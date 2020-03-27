// To start redis type : sudo redis-server /etc/redis/redis.conf
// To start redis client type : sudo redis-cli
// List of redis commands : https://redis.io/commands
// Redis node.js client : https://github.com/NodeRedis/node_redis
// Rest API https://www.restapitutorial.com/lessons/httpmethods.html

const express = require("express"), app = express();
const mysql = require("mysql");
const helmet = require("helmet");
const bodyParser = require('body-parser');
const multer = require('multer'), upload = multer({dest: "./public/temp"});

// Pooling DB connections, we can have multiple queries running at the same time from different calls to the API.
const pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 20, // This can be changed to increase the maximum number of concurrent conenctions
    host: "localhost",
    user: "root",
    password: "root",
    database: "jobDB"
});


/* #region APP properties */

// Setting up the headers for cross origin requests (CORS)
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Required for pretty json response 
app.set('json spaces', 2);

// Setting helmet as security module
app.use(helmet());

// Setting up the bodyparser for POST, PUT, PATCH verbs when using form-data
app.use(bodyParser.urlencoded({ extended: true }));

// Adding routes to the App
require('./routes/UsersRoutes')(app, upload, pool);
require('./routes/JobsRoutes')(app, upload, pool);
require('./routes/SkillsRoutes')(app, upload, pool);
require('./routes/DomainsRoutes')(app, upload, pool);
require('./routes/MatcherRoutes')(app, upload, pool);

/* #endregion */

console.log("Listening on port 8080");
app.listen(8080);