const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getNotes', mid.requiresLogin, controllers.Notes.getNotes);
  app.delete('/removeNote', mid.requiresLogin, controllers.Notes.remove);
  // app.post('/removeNote', mid.requiresLogin, controllers.Notes.remove);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePage);
  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePW);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Notes.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Notes.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/about', mid.requiresSecure, controllers.Account.aboutPage);
  app.get('*', mid.requiresSecure, controllers.Account.errorPage);
  console.log('end of router');
};

module.exports = router;

