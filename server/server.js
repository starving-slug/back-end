require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {User} = require('./models/user');
let {Recipe} = require('./models/recipe');

let app = express();
const port = process.env.PORT;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database!");
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

// POST /users
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'username', 'password']);
  let user = new User(body);

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// GET /users/username
app.get('/users/:username',(req, res) => {
  let uname = req.params.username;

  User.findOne({'username': uname}, 'email username tokens').then((user) => {
    if (user) {
      res.status(200).send(user);
    }
    res.status(404).send();
  }).catch((e) => {
    res.status(404).send(e);
  });
});

// POST /recipe
app.post('/recipe', (req, res) => {
  let body = _.pick(req.body, ['name', 'author', 'description', 'photo', 'ingredients', 'directions', 'tags']);
  let recipe = new Recipe(body);
  

  recipe.save().then((recipe) => {
    res.status(200).send('Successfully saved recipe!');
  }).catch((e) => {
    res.status(e.staus || 400).send(e);
  })
})


// GET /recipe/:id
app.get('/recipe/:id', (req, res) => {
  let id = req.params.id;

  // if id is not valid
  if(!ObjectID.isValid(id)) {
    res.status(400).send();
  }

  // find recipe by ID
  Recipe.findById(id).then(() => {

  });
  Recipe.findOne({'recipe_id': id}).then((recipe) => {
    if (recipe) {
      res.status(200).send(recipe);
    }
    res.status(404).send();
  }).catch(e => res.status(404).send(e));
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
