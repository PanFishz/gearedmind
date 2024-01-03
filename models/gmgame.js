const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define schema
const gmgameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    players: {
        type: String,
        required: true
    },
    playtime: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Competitive', 'Co-op'],
        required: true
    },
    age: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    designer: String,
    artist: String,
    image: String,


});


//make a collection called "gmgame" using the schema defined above "gmgameSchema"
module.exports = mongoose.model('gmgame', gmgameSchema)