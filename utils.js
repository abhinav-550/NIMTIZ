const requireLogin = (req, res , next) => {
    if(req.session.userId){
        return next();
    }
    res.redirect('/login'  )
}

module.exports = requireLogin;