const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houserulesSchema = new Schema({
    gameTitle: {
        type: String,
        required: true
    },
    gameTitle_lower: {
        type: String,
        required: true
    },

    rules: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rule'
        }
    ]
})



module.exports = mongoose.model('Houserule', houserulesSchema)

