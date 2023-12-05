const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('users/register')
}

module.exports.registrationNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        console.log(req.body, email)
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                console.log("erreee")
                return next(err);
            }
            req.flash('success', 'Successfully registered');
            res.redirect('/gearedmind')
        })
    } catch (e) {
        req.flash('error', 'Either username or email is already in use');
        res.redirect('/gearedmind/users/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Successfully logged in');
    const redirectUrl = res.locals.returnTo || '/gearedmind'
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/gearedmind')
    })
}