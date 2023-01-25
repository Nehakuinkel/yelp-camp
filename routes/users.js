const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const {logout, getRegister, postRegister, getLogin, postLogin } = require('../controllers/users');

router.get('/register' , getRegister)

router.post('/register',catchAsync( postRegister ));

router.get('/login', getLogin)

router.post('/login' , passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}) ,postLogin)

router.get('/logout', logout);


module.exports = router;