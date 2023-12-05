const Gmgame = require('../models/gmgame.js')
const ExpressError = require('../utils/ExpressError.js')

module.exports.index = async (req, res) => {
    const gmgames = await Gmgame.find({});
    res.render('games/index', { gmgames })
}

module.exports.pageNotFound = (req, res, next) => {
    next(new ExpressError('Page not found :(', 404))
}

module.exports.error = (err, req, res, next) => {
    const statusCode = err.status || 500;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render("error", { err })
}