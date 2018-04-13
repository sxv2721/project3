const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
    //console.log(req.csrfToken());
    res.render('login', { csrfToken: req.csrfToken() });
};

/*const signupPage = (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken() });
};/**/

const changePage = (req, res) => {
    res.render('changepass', {csrfToken: req.csrfToken()});
};
const aboutPage = (req, res) => {
    res.render('about', {csrfToken: req.csrfToken()});
}
const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

const login = (request, response) => {
    const req = request;
    const res = response;
    
    const username = `${req.body.username}`;
    const password = `${req.body.pass}`;
    
    if(!username || !password){
        return res.status(400).json({ error: 'RAWR! All fields are required'});
    }
    
    return Account.AccountModel.authenticate(username, password, (err, account) => {
        if(err || !account){
            return res.status(401).json({ error: 'Wrong username or password'});
        }
        
        req.session.account = Account.AccountModel.toAPI(account);
        
        return res.json({ redirect: '/maker'});
    });
};

const signup = (request, response) => {
    const req = request;
    const res = response;
    
    req.body.username = `${req.body.username}`;
    req.body.pass = `${req.body.pass}`;
    req.body.pass2 = `${req.body.pass2}`;
    
    if(!req.body.username || !req.body.pass || !req.body.pass2) {
        return res.status(400).json({ error: 'RAWR! All fields are required' });
    }
    
    if(req.body.pass !== req.body.pass2) {
        return res.status(400).json({ error: 'RAWR! Passwords do not match' });
    }
    
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        const accountData = {
            username: req.body.username,
            salt,
            password: hash,
        };
        
        const newAccount = new Account.AccountModel(accountData);
        
        const savePromise = newAccount.save();
        
        savePromise.then(() => {
            req.session.account = Account.AccountModel.toAPI(newAccount);
            res.json({redirect: '/maker'})
            });
        
        savePromise.catch((err) => {
            console.log(err);
            
            if(err.code === 11000) {
                return res.status(400).json({ error: 'Username already in use.'});
            }
            
            return res.status(400).json({ error: 'An error occurred'});
        });
    });
};

const changePW = (request, response) => {
    const req = request;
    const res = response;
    
    req.body._id =`${req.session.account._id}`;
    req.body.pass = `${req.body.pass}`;
    req.body.pass2 = `${req.body.pass2}`;
    
    if(!req.body.pass || !req.body.pass2) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if(req.body.pass !== req.body.pass2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        return Account.AccountModel.findById(req.body._id, (err, account)=> {
           if(err){
               console.log(err);
               
               return res.status(400).json({error: 'an error occurred'});
           } 
            account.password = hash;
            account.salt = salt;
            
            account.save((err) => {
                if(err){
                    console.log(err);
               
                    return res.status(400).json({error: 'an  error occurred'});
                } 
                return res.json({redirect: '/maker'}); 
            });
        });
    });
};/**/
const getToken = (request, response) => {
    const req = request;
    const res = response;
    
    const csrfJSON = {
        csrfToken: req.csrfToken(),
    };
    //console.log(csrfJSON);
    res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.changePage = changePage;
module.exports.aboutPage = aboutPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePW = changePW;