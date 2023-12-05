const mongoose = require("mongoose");
const Gmgame = require('../../models/gmgame.js');
const gmgames = require('./gmgames.js');

mongoose.connect('mongodb://localhost:27017/Gearedmind')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Gmgame.deleteMany({});
    //console.log(gmgames['gmgames'])
    // gmgames is {gmgames: [{}, {}]}
    //must use gmgames['gmgames'] to get iteratable array [{}, {}]
    for (let gmgame of gmgames['gmgames']) {
        const game = new Gmgame({ ...gmgame });
        await game.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})