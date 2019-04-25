const mongoose = require('mongoose');

let answerSchema = new mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    author: String,
    content: String,
    likes: Number
});

let Answer = mongoose.model('Answer', answerSchema);
module.exports = mongoose.model('Answer', answerSchema);