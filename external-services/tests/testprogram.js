// To start redis type : sudo redis-server /etc/redis/redis.conf
// To start redis client type : sudo redis-cli
// List of redis commands : https://redis.io/commands
// Redis node.js client : https://github.com/NodeRedis/node_redis
// Rest API https://www.restapitutorial.com/lessons/httpmethods.html

const express = require("../api/node_modules/express"), app = express();
const mysql = require("../api/node_modules/mysql");
const helmet = require("../api/node_modules/helmet");
const bodyParser = require('../api/node_modules/body-parser');
const multer = require('../api/node_modules/multer'), upload = multer({dest: "./public/temp"});

// Pooling DB connections, we can have multiple queries running at the same time from different calls to the API.
const pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 20, // This can be changed to increase the maximum number of concurrent conenctions
    host: "localhost",
    user: "root",
    password: "root",
    database: "jobDB"
});

const test = require('../api/matcher');

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
require('../api/routes/UsersRoutes')(app, upload, pool);
require('../api/routes/JobsRoutes')(app, upload, pool);
require('../api/routes/SkillsRoutes')(app, upload, pool);
require('../api/routes/DomainsRoutes')(app, upload, pool);
require('../api/routes/MatcherRoutes')(app, upload, pool);

/* #endregion */

test.matchUserJobsRaw(4,pool,false, function(err,res){
    console.log
    process.exit(0);
});
console.log("Listening on port 8080");
app.listen(8080);