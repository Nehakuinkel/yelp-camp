module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //store url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be Logged In first')
        return res.redirect('/login')
    }
    next();
}
