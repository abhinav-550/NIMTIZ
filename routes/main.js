const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const requireLogin = require('../utils.js');
const session = require('express-session');
const flash = require('connect-flash');

// Use session middleware
router.use(session({
    secret: 'yourSecretKey', // replace with your own secret
    resave: false,
    saveUninitialized: false
}));

// Use flash middleware
router.use(flash());

// Middleware to make flash messages available in all templates
router.use((req, res, next) => {
    res.locals.invalidAuth = req.flash('invalidAuth');
    next();
});

router.get('/', (req, res) => {
    let loggedIn = false;
    if(req.session.userId){
        loggedIn = true;
    }
    res.render('homepage',{loggedIn});
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;    
    const userId = await User.evaluateAndAuthenticate(Email, Password);
    if (userId != null) {
        req.session.userId = userId;
        res.redirect('/');
    } else {
        req.flash('invalidAuth', 'Invalid Email or Password');
        res.redirect('/login'); // Redirect to login page to show flash message
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { Password, ...otherDetails } = req.body;
    let userId = await User.createAndRegister(Password, otherDetails);
    req.session.userId = userId;
    res.redirect('/');
});

router.get('/users/:id', requireLogin, async (req, res, next) => {
    const { id } = req.params;
    const findUser = await User.findOne({ id });    
    res.render('userprofile');
});

module.exports = router;
