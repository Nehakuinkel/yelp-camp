const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const { isLoggedIn } = require('../middleware/auth');

router.get('/register' , (req,res) => {
    res.render('user/register');
})

router.post('/register',catchAsync( async(req,res) => {
    try{
        const { email , username, password} =req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err)
            }
            req.flash('success','Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
    
}));

router.get('/login', (req,res) => {
    res.render('user/login');
})

router.post('/login' , passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}) ,(req,res) => {
    console.log("req.session.returnTo in login", req.session)
    req.flash('success', 'Welcome Back');
    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


module.exports = router;