const mongoose = require('mongoose');
//let Answer = require('../models/Answer');

let answerSchema = new mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    ref_id: Number,
    author: String,
    content: String,
    likes: Number
});

let questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    //answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}]
    answers: [answerSchema]
});

module.exports = mongoose.model('Question', questionSchema);