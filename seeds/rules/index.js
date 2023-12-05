const mongoose = require("mongoose");
const Houserule = require("../../models/houserules.js");
const Rule = require("../../models/rule.js");
const { gameTitles, rules } = require('./rules.js')

mongoose.connect('mongodb://localhost:27017/Gearedmind')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Houserule.deleteMany({});
    for (let title of gameTitles) {
        const houserule = new Houserule({
            gameTitle: title, gameTitle_lower: title.toLocaleLowerCase()
        })

        for (let rule of rules) {
            const newrule = new Rule({ ...rule })
            houserule.rules.push(newrule)
            await newrule.save()
        }
        await houserule.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})