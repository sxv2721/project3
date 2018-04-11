const controllers = require('./controllers');
const mid = require('./middleware');

console.dir(controllers);
const router = (app) => {
    app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    app.get('/getNotes', mid.requiresLogin, controllers.Notes.getNotes);
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout,  controllers.Account.login);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/maker', mid.requiresLogin, controllers.Notes.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Notes.make);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

