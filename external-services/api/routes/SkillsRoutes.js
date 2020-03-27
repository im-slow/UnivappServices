// Skills routes
var skills_controller = require('../controllers/SkillsController');

/**
 * @param {App} app The express app on which these routes will be added
 * @param {Upload} upload The upload manager from multer
 * @param {Pool} pool A connection pool from where retrieve a connection
 */
module.exports = function(app, upload, pool) {

    app.get('/api/skills/:id', function(req,res) {
        skills_controller.getSkillData(pool,req,res);
    });
    
    app.get('/api/skills', function(req,res) {
        skills_controller.getSkillsList(pool,req,res);
    });
    
    app.post('/api/skills', upload.none(), (req,res) => {
        skills_controller.createSkill(pool,req,res,req.body);
    });
    
    app.patch('/api/skills/:id', upload.none(), (req,res) => {
        skills_controller.patchSkill(pool,req,res,req.body);
    });
    app.patch('/api/skills', function(req,res) {
        skills_controller.patchSkill(pool,req,res,req.body);
    });
    
    app.put('/api/skills/:id', upload.none(), (req,res) => {
        skills_controller.putSkill(pool,req,res,req.body);
    });
    app.put('/api/skills', function(req,res) {
        skills_controller.putSkill(pool,req,res,req.body);
    });
    
    app.delete('/api/skills/:id', function(req,res) {
        skills_controller.deleteSkill(pool,req,res);
    });
    app.delete('/api/skills', function(req,res){
        skills_controller.deleteSkill(pool,req,res);
    });

}