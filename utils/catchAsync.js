// this middleware should be applied to all async functions
// as in "catchAsync(game.showGame)" where game.showGame is an aync function

module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}