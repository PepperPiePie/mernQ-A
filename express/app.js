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

let questionSchema = new mongoose.Schema({
    // id: Number,
    title: String,
    description: String,
    tags: [String]
});

let Question = mongoose.model('Question', questionSchema);



const port = (process.env.PORT || 8080);

/****** Data *****/
/* const data = [
    {
        id: 0,
        title: "Apple pie",
        description: "Apple pie is best served warm with a scoop of vanilla ice-cream",
        ingredients: ['apples', 'eggs', 'butter', 'flour', 'sugar', 'cinnamon'],
        prep_time: 20,
        total_time: 80
    },
    {
        id: 1,
        title: "Cherry pie",
        description: "American classic from good old times",
        ingredients: ['cherries', 'egg', 'butter', 'flour', 'sugar'],
        prep_time: 10,
        total_time: 60
    },
    {
        id: 2,
        title: "Lemon meringue pie",
        description: "For fans of strong experiences",
        ingredients: ['lemons', 'oranges', 'egg', 'butter', 'flour', 'sugar', 'cinnamon'],
        prep_time: 40,
        total_time: 80
    },
    {
        id: 3,
        title: "Pizza",
        description: "Pizza is nice",
        ingredients: ['cheese', 'tomato', 'onion'],
        prep_time: 20,
        total_time: 30
    },
    {
        id: 4,
        title: "Vegetable Quiche",
        description: "Nice with shredded zucchini",
        ingredients: ['cheese', 'zucchini', 'onion'],
        prep_time: 30,
        total_time: 90
    },
    {
        id: 5,
        title: "Baked Potato with Fried Eggs",
        description: "Served with bakes beans",
        ingredients: ['potato', 'beans', 'egg'],
        prep_time: 10,
        total_time: 70
    }
]; */

/****** Helper functions *****/
function getQuestionFromId(id) {
    return data.find((elm) => elm.id === Number(id));
}

function filterByTags(tag) {
    return data.filter((elm) => elm.tags.includes(tag))
}

function findNextId() {
    const reducer = (acc, curr) => Math.max(acc, curr);
    let nextId = data.map(el => el.id).reduce(reducer) + 1;
    return nextId;
}

/****** Routes *****/
// GET
app.get('/questions/', (req, res) => {
    //res.json(data)
    Question.find({}, (err, questions) => {
        res.json(questions);
    }).sort({title: 1})
});

app.get('/questions/:id', (req, res) => {
    Question.find({_id: req.params.id}, (err, questions) => {
        res.json(questions);
    })
});

app.get('/questions/with/:tag', (req, res) => {
    Question.find({tags: req.params.tags}, (err, questions) => {
        res.json(questions);
    })
});


// POST
app.post('/questions', (req, res) => {
    let newQuestion = new Question({
        //id: findNextId(),
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
    });
    if(!newQuestion.title || !newQuestion.description || !newQuestion.tags) {
        return res.status(400).json({ msg: 'Please include title, description and list of tags' });
    }

    newQuestion
        .save()
        .then(result => res.json({ msg: `You have posted this recipe: ${req.body.title}`}))
        .catch(err => console.log(err));
});


// PUT
app.put('/questions/:id', (req, res) => {
    Question.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(function(question){res.send(question)})
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

app.listen(port, () => console.log(`Cooking API running on port ${port}!`));

