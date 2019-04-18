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

let recipeSchema = new mongoose.Schema({
    // id: Number,
    title: String,
    description: String,
    ingredients: [String],
    prep_time: Number,
    total_time: Number
});

let Recipe = mongoose.model('Recipe', recipeSchema);



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
function getRecipeFromId(id) {
    return data.find((elm) => elm.id === Number(id));
}

function filterByIngredient(ingredient) {
    return data.filter((elm) => elm.ingredients.includes(ingredient))
}

function findNextId() {
    const reducer = (acc, curr) => Math.max(acc, curr);
    let nextId = data.map(el => el.id).reduce(reducer) + 1;
    return nextId;
}

/****** Routes *****/
// GET
app.get('/recipes/', (req, res) => {
    //res.json(data)
    Recipe.find({}, (err, recipes) => {
        res.json(recipes);
    }).sort({title: 1})
});

app.get('/recipes/:id', (req, res) => {
    //res.json(data.filter(elm => elm.id === parseInt(req.params.id)));
    //res.json({ msg: `You have sent this id: ${req.params.id}`});
    Recipe.find({_id: req.params.id}, (err, recipes) => {
        res.json(recipes);
    })
});

app.get('/recipes/with/:ingredients', (req, res) => {
    //res.json(data.filter((elm) => elm.ingredients.includes(req.params.ingredients)));
    //res.json({ msg: `You have sent this ingredient: ${req.params.ingredients}`});
    Recipe.find({ingredients: req.params.ingredients}, (err, recipes) => {
        res.json(recipes);
    })
});


// POST
app.post('/recipes', (req, res) => {
    let newRecipe = new Recipe({
        //id: findNextId(),
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        prep_time: req.body.prep_time,
        total_time: req.body.total_time
    });
    if(!newRecipe.title || !newRecipe.description || !newRecipe.ingredients || !newRecipe.prep_time || !newRecipe.total_time) {
        return res.status(400).json({ msg: 'Please include title, description, list of ingredients for recipe, as well as preparation and total time' });
    }
    /*newRecipe.save(err => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(newRecipe);
    });*/
    newRecipe
        .save()
        .then(result => res.json({ msg: `You have posted this recipe: ${req.body.title}`}))
        .catch(err => console.log(err));
});


// PUT
app.put('/recipes/:id', (req, res) => {
    Recipe.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(function(recipe){res.send(recipe)})
        .then(console.log(`Recipe ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

app.listen(port, () => console.log(`Cooking API running on port ${port}!`));

