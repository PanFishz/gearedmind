const Gmgame = require('../models/gmgame.js')
const Review = require('../models/review');

//Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.

module.exports.showGame = async (req, res) => {
    const { id } = req.params;
    const game = await Gmgame.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
    if (!game) {
        req.flash('error', 'Game not found')
        res.redirect('/')
    }
    //render views/game/show.ejs template, shorthand made possible bc the following setup in app.js
    //app.engine('ejs', ejsMate)
    //app.set('view engine', 'ejs');
    //app.set('views', path.join(__dirname, 'views'))
    res.render('games/show', { game })
}

module.exports.postGameReview = async (req, res) => {
    const game = await Gmgame.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    game.reviews.push(review)
    await review.save();
    await game.save();
    req.flash('success', 'Successfully submited a review');
    res.redirect(`/games/${game._id}`)
}

module.exports.deleteGameReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Gmgame.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/games/${id}`)
}