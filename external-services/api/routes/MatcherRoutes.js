// Matcher routes
var matcher_controller = require('../controllers/MatcherController');

/**
 * @param {App} app The express app on which these routes will be added
 * @param {Upload} upload The upload manager from multer
 * @param {Pool} pool A connection pool from where retrieve a connection
 */
module.exports = function(app, upload, pool) {

    app.post('/api/match/raw', upload.none(), function(req, res) {
        matcher_controller.newRawMatch(pool, req, res, req.body, req.query['cacheless']);
    });

    app.post('/api/match/refined', upload.none(), function(req, res) {
        matcher_controller.newRefinedMatch(pool, req, res, req.body, req.query['cacheless']);
    });

    app.post('/api/match/raw/deprecate', upload.none(), function(req, res) {
        matcher_controller.makeObsolete(req,res,req.body,"raw");
    });

    app.post('/api/match/refined/deprecate', upload.none(), function(req, res) {
        matcher_controller.makeObsolete(req,res,req.body,"refined");
    });

}