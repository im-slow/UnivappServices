// Domains routes
var domains_controller = require('../controllers/DomainsController');

/**
 * @param {App} app The express app on which these routes will be added
 * @param {Upload} upload The upload manager from multer
 * @param {Pool} pool A connection pool from where retrieve a connection
 */
module.exports = function(app, upload, pool) {

    app.get('/api/domains/:id', function(req,res) {
        domains_controller.getDomainData(pool,req,res);
    });
    
    app.get('/api/domains', function(req,res) {
        domains_controller.getDomainsList(pool,req,res);
    });
    
    app.post('/api/domains', upload.none(), (req,res) => {
        domains_controller.createDomain(pool,req,res,req.body);
    });
    
    app.patch('/api/domains/:id', upload.none(), (req,res) => {
        domains_controller.patchDomain(pool,req,res,req.body);
    });
    app.patch('/api/domains', function(req,res) {
        domains_controller.patchDomain(pool,req,res,req.body);
    });
    
    app.put('/api/domains/:id', upload.none(), (req,res) => {
        domains_controller.putDomain(pool,req,res,req.body);
    });
    app.put('/api/domains', function(req,res) {
        domains_controller.putDomain(pool,req,res,req.body);
    });
    
    app.delete('/api/domains/:id', function(req,res) {
        domains_controller.deleteDomain(pool,req,res);
    });
    app.delete('/api/domains', function(req,res){
        domains_controller.deleteDomain(pool,req,res);
    });

}