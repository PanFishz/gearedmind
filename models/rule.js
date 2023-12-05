const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const ruleSchema = new Schema({
    rule: {
        type: String,
        required: true
    },
    images: [imageSchema],
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }


})



module.exports = mongoose.model('Rule', ruleSchema)