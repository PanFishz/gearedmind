const express = require('express');
const router = express.Router();

//import controllers
const game = require('../controllers/games.js')

const catchAsync = require('../utils/catchAsync.js')

const { validateReview, isLoggedIn, isAuthor } = require('../middleware')

router.route("/:id")
    .get(catchAsync(game.showGame))
    .post(isLoggedIn, validateReview, catchAsync(game.postGameReview))
// code above groups routes below, because both share the same path"/:id"
// router.get("/:id", catchAsync(game.showGame));
// router.post("/:id", isLoggedIn, validateReview, catchAsync(game.postGameReview));

router.delete("/:id/reviews/:reviewId", isLoggedIn, isAuthor, catchAsync(game.deleteGameReview));



module.exports = router;