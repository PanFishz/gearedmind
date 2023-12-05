const { reviewSchema, ruleSchema } = require('./joiValidationSchema.js');
const ExpressError = require("./utils/ExpressError.js");
const Review = require('./models/review.js')
const Rule = require('./models/rule.js')
const Houserule = require('./models/houserules.js')

//cant use arrow function here must use function() & module.exports
module.exports.validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateRule = async function (req, res, next) {
    const { error } = ruleSchema.validate(req.body);
    if (error) {
        req.flash('error', 'Rule must not be empty')
        // const msg = error.details.map(el => el.message).join(',')
        // throw new ExpressError(msg, 400)

        const { id } = req.params;
        const houserule = await Houserule.findById(id);
        return res.redirect(`/gearedmind/rules/${id}`)


    } else {
        next();
    }
}


module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in first')
        return res.redirect('/gearedmind/users/login')
    }
    next();

}

module.exports.isAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gearedmind/games/${id}`);
    }
    next();
}

module.exports.isRuleAuthor = async (req, res, next) => {
    const { id, ruleId } = req.params;
    const rule = await Rule.findById(ruleId);
    console.log(ruleId)
    if (!rule.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/gearedmind/rules/${id}`);
    }
    next();
}

module.exports.storeReturnTo = function (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

