/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

/****** Configuration *****/

// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});




/****** Mongoose *****/
const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_URL;
mongoose.connect(
    `${dbUrl}`,
    { useNewUrlParser: true }
    // { useMongoClient: true } no longer needed in Mongoose 5.0, instead see line above
);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB connection is open.");
});


// ********** Models **********
//let Question = require('../models/Question');
//let Answer = require('../models/Answer');

let answerSchema = new mongoose.Schema({
    author: String,
    content: String,
    likes: Number
});

// const Schema = mongoose.Schema;

let questionSchema = new mongoose.Schema({
    title: String,

    description: String,
    tags: [String],
    //answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}]
    answers: [answerSchema]
});

let Answer = mongoose.model('Answer', answerSchema);
let Question = mongoose.model('Question', questionSchema);


const port = (process.env.PORT || 8080);

/****** Routes *****/
// GET
app.get('/api/questions/', (req, res) => {
    //res.json(data)
    Question.find({}, (err, questions) => {
        res.json(questions);
    }).sort({title: 1})
});

app.get('/api/questions/:id', (req, res) => {
    Question.find({_id: req.params.id}, (err, questions) => {
        res.json(questions);
    })
});

// app.get('/questions/:id', (req, res) => {
//     Question.find({_id: req.params.id}.populate('answers'), (err, questions) => {
//         res.json(questions);
//     })
// });

app.get('/api/questions/with/:tag', (req, res) => {
    Question.find({tags: req.params.tags}, (err, questions) => {
        res.json(questions);
    })
});


// POST
app.post('/api/questions', (req, res) => {
    let newQuestion = new Question({
        //id: findNextId(),
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        answers: req.body.answers
    });
    if(!newQuestion.title || !newQuestion.description || !newQuestion.tags) {
        return res.status(400).json({ msg: 'Please include title, description and list of tags' });
    }

    newQuestion
        .save()
        .then(result => res.json({ msg: `You have posted this recipe: ${req.body.title}`}))
        .catch(err => console.log(err));
});

// app.post('/questions/:id/answer', (req, res) => {
//
//     let newAnswer = new Answer ({
//         author: req.body.author,
//         content: req.body.content,
//         likes: req.body.likes});
//
//     if(!newAnswer.author || !newAnswer.content) {
//         return res.status(400).json({ msg: 'Please include your name and answer' });
//     }
//
//     newAnswer
//         .save()
//         .then(result => res.json({ msg: `You have posted this answer: ${req.body.content}`}))
//         .catch(err => console.log(err));
//
//     let answerID = Answer.findOne({content : req.body.content}, '_id');
//
//     Question.findOneAndUpdate({_id: req.params.id}, {$push: {answers: answerID}}, {new: true})
//         .then(function (question) {
//             res.send(question)
//         })
//         .then(console.log(`Answer ${answerID} was added to question ${req.params.id}`))
//         .catch(err => console.log(err))
// });


// PUT
app.put('/api/questions/:id', (req, res) => {
    Question.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(function(question){res.send(question)})
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

app.put('/api/questions/:id/answer', (req, res) => {

    let newAnswer = new Answer ({
        author: req.body.author,
        content: req.body.content,
        likes: req.body.likes});

    if(!newAnswer.author || !newAnswer.content) {
        return res.status(400).json({ msg: 'Please include your name and answer' });
    }

    Question.findOneAndUpdate({_id: req.params.id}, {$push: {answers: newAnswer}}, {new: true})
        .then(function (question) {
            res.send(question)
        })
        .then(console.log(`Answer to question ${req.params.id} was added`))
        .catch(err => console.log(err))
});

app.put('/api/questions/:id/answer/like', (req, res) => {
    Question.updateOne({'answers._id': req.body.id}, {$set: {'answers.$.likes': req.body.likes}}, {new: true})
        .then(function (question) {
            res.send(question)
        })
        .then(console.log(`Likes for answer was added`))
        .catch(err => console.log(err))
});

/**** Reroute all unknown requests to the React index.html ****/
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => console.log(`Q&A API running on port ${port}!`));

