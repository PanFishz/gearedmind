const mongoose = require("mongoose");
const Gmgame = require('../../models/gmgame.js');
const gmgames = require('./gmgames.js');

mongoose.connect('mongodb+srv://rinmeyers:gFSJfwwE3JItN9b5@cluster0.opyva2x.mongodb.net/?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    //delete b4 repopulate db
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

//in terminal call "node seeds/games" (automatically run "seeds/games/index.js" )to reseed/repopulate