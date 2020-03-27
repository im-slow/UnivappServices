// Jobs Routes
var jobs_controller = require('../controllers/JobsController');

/**
 * @param {App} app The express app on which these routes will be added
 * @param {Upload} upload The upload manager from multer
 * @param {Pool} pool A connection pool from where retrieve a connection
 */
module.exports = function(app, upload, pool) {

    app.get('/api/jobs/:id', function(req,res) {
        jobs_controller.getJobsData(pool,req,res);
    });
    
    app.get('/api/jobs', function(req,res) {
        jobs_controller.getJobsList(pool,req,res);
    });
    
    app.post('/api/jobs', upload.none(), (req,res) => {
        jobs_controller.createJob(pool,req,res,req.body);
    });
    
    app.patch('/api/jobs/:id', upload.none(), (req,res) => {
        jobs_controller.patchJob(pool,req,res,req.body);
    });
    app.patch('/api/jobs', function(req,res) {
        jobs_controller.patchJob(pool,req,res,req.body);
    });
    
    app.put('/api/jobs/:id', upload.none(), (req,res) => {
        jobs_controller.putJob(pool,req,res,req.body);
    });
    app.put('/api/jobs', function(req,res) {
        jobs_controller.putJob(pool,req,res,req.body);
    });
    
    app.delete('/api/jobs/:id', function(req,res) {
        jobs_controller.deleteJob(pool,req,res);
    });
    app.delete('/api/jobs', function(req,res) {
        jobs_controller.deleteJob(pool,req,res);
    });
    
    app.get('/api/jobs/:id/skills', (req,res) => {
        jobs_controller.getDefaultSkills(pool,req,res);
    });
    
    app.post('/api/jobs/:id/skills', upload.none(), (req,res) => {
        jobs_controller.addDefaultSkills(pool,req,res,req.body);
    });
    
    app.put('/api/jobs/:id/skills', upload.none(), (req,res) => {
        jobs_controller.putDefaultSkills(pool,req,res,req.body);
    });
    
    app.patch('/api/jobs/:id/skills', upload.none(), (req,res) => {
        jobs_controller.patchDefaultSkills(pool,req,res,req.body);
    });
    
    app.delete('/api/jobs/:id/skills', upload.none(), (req,res) => {
        jobs_controller.deleteDefaultSkills(pool,req,res,req.body);
    });

}