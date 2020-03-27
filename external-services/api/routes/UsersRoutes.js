// Users Routes
var users_controller = require('../controllers/UsersController');

/**
 * @param {App} app The express app on which these routes will be added
 * @param {Upload} upload The upload manager from multer
 * @param {Pool} pool A connection pool from where retrieve a connection
 */
module.exports = function(app, upload, pool) {

    // Gets a single user data
    app.get('/api/users/:id', function(req,res) {
        users_controller.getUserData(pool,req,res);
    });
    // Gets a page of users data, example: http://localhost:8000/api/users?p=4%pl=20 this gets the 4th page, when the output is paged by 20
    app.get('/api/users', function(req,res) {
        users_controller.getUsersList(pool,req,res);
    });
    // Creates a new user
    app.post('/api/users', upload.single("avatar"), (req,res) => {
        users_controller.createUser(pool,req,res,req.body);    
    });
    // Updates an existing user works with partial updates
    app.patch('/api/users/:id', upload.single("avatar"), (req,res) => {
        users_controller.patchUser(pool,req,res,req.body);
    });
    app.patch('/api/users', function(req,res) {
        users_controller.patchUser(pool,req,res,req.body);
    });
    // Updates an existing user, does not work with partial updates
    app.put('/api/users/:id', upload.single("avatar"), (req,res) => {
        users_controller.putUser(pool,req,res,req.body);
    });
    app.put('/api/users', function(req,res) {
        users_controller.putUser(pool,req,res,req.body);
    });
    // Deletes the user at the given ID
    app.delete('/api/users/:id', function(req,res) {
        users_controller.deleteUser(pool,req,res);
    });
    app.delete('/api/users', function(req,res){
        users_controller.deleteUser(pool,req,res);
    });
    app.get('/api/users/:id/avatar', function(req,res) {
        users_controller.getPropic(pool,req,res);
    });
    app.get('/api/users/avatar', function(req,res) {
        users_controller.getPropic(pool,req,res);
    });
    app.delete('/api/users/:id/avatar', function(req,res) {
        users_controller.deleteUserPropic(pool,req,res);
    })
    app.get('/api/users/:id/skills', (req,res) => {
        users_controller.getDefaultSkills(pool,req,res);
    });

    app.post('/api/users/:id/skills', upload.none(), (req,res) => {
        users_controller.addDefaultSkills(pool,req,res,req.body);
    });

    app.put('/api/users/:id/skills', upload.none(), (req,res) => {
        users_controller.putDefaultSkills(pool,req,res,req.body);
    });

    app.patch('/api/users/:id/skills', upload.none(), (req,res) => {
        users_controller.patchDefaultSkills(pool,req,res,req.body);
    });

    app.delete('/api/users/:id/skills', upload.none(), (req,res) => {
        users_controller.deleteDefaultSkills(pool,req,res,req.body);
    });
}




