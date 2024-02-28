const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const passport = require('passport');
const users = require('../controllers/users.js')
const { storeReturnTo } = require('../middleware')

router.route('/register')
    .get(users.renderRegistrationForm)
    .post(catchAsync(users.registrationNewUser))
// code above groups routes below, because both share the same path "/register"
// router.get('/register', users.renderRegistrationForm)
// router.post('/register', catchAsync(users.registrationNewUser))


router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/gearedmind/users/login' }),
        users.loginUser)
// router.get('/login', users.renderLoginForm)
// router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/gearedmind/users/login' }),
//     users.loginUser)

router.get('/logout', users.logoutUser)

module.exports = router