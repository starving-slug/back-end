"use strict";

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const Promise = require('bluebird');

let {mongoose} = require('./db/mongoose');
let {User} = require('./models/user');
let {Recipe} = require('./models/recipe');
let {Profile} = require('./models/profile');

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
    res.status(200).send("Successfully created User");
  }).catch((e) => {
    res.status(400).send({message: e.message});
  })
});

// GET /users/username
app.get('/users/:username',(req, res) => {
  let uname = req.params.username;

  User.findOne({'username': uname}, 'email username tokens').then((user) => {
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send(`${uname} not found :(`);
    }
  }).catch((e) => {
    res.status(400).send({message: e.message});
  });
});

// GET /search
app.get('/search', (req, res) => {
  // Example test:
  // GET localhost:3000/search?author=KevLoi&tag=omega&tag=Meat
  // req.query.author = KevLoi
  // req.query.tag = ['omega', 'Meat']
  // returns all recipes by author KevLoi that has both tag substrings, omega and Meat
  // or simple a test: GET localhost:3000/search => returns all recipes
  let nameList = setRegex(req.query.name);
  let authorList = setRegex(req.query.author);
  let tagList = setRegex(req.query.tag);

  // Search: { (n1 OR n2 OR ... OR nk) AND (a1 OR a2 OR ... OR ak) AND (tag1 AND tag2 AND ... AND tagk) }
  Recipe.find({'$and': [{'name': nameList}, {'author': authorList}, {'tags.text': {'$all': tagList}}]}, '_id name author description tags').then((recipes) => {
    console.log(recipes);
    if (recipes) {
      let response = recipes;
      res.status(200).send(response);
    }
    console.log("recipe(s) not found");
    res.status(404).send();
  }).catch((e) => {
    res.status(400).send({message: e.message})
  });
});

// Transform tag(s) in a string (or array) into a regex that ignores capitalization
function setRegex(list) {
  let listReg = [];
  if (typeof list == "string") { // One tag (string)
    listReg = new RegExp(list, "i");
  }else if (Object.prototype.toString.call(list) == "[object Array]") { // Multiple tags (array)
    //listReg = new RegExp(list.join("|"), "i"); // OR (word1|word2)
    listReg = list.map(function(word) { return new RegExp(word, "i"); });
  }else { // No tags (undefined)
    listReg = new RegExp(".*", "i");
  }
  console.log(listReg);
  return listReg;
}

// POST profile
app.post('/setProfile', (req, res) => {
  let body = _.pick(req.body, ['user', 'description', 'image']);
  console.log(body);
  // test user for valid session
  let profile = new Profile({username: body.user.name, image: body.image, description: body.description});

  profile.save().then((foo) => {
    console.log(foo);
    res.status(200).send({message: `Successfully saved profile for ${body.user.name}`});
  }).catch((e) => {
    console.log(e.message);
    res.status(400).send({message: e.message});
  });
})

// Get user profile
app.get('/profile/:username', (req, res) => {
  let uname = req.params.username;
  let recipeList = Recipe.find({'author': uname}, '_id name description');
  let profileReq = Profile.findOne({'username': uname}, 'username image description');

  // let promise = Promise.join(recipeList, profileReq, function(recipes, profile) {
  //   console.log(recipes, profile);
  //   if (recipes && profile) {
  //     let response = {
  //       username: profile.username,
  //       description: profile.description,
  //       image: profile.image,
  //       recipes: recipes
  //     }
  //     res.status(200).send(response);
  //   }
  //   res.status(404).send();
  // }).catch((e) => {
  //   res.status(400).send({message: e.message});
  // })

  Recipe.find({'author': uname}, '_id name description').then((recipes) => {
    console.log(recipes);
    if (recipes) {
      let response = {
        usename: uname,
        description: 'Test description',
        recipes: recipes
      }
      console.log(response)
      res.status(200).send(response);
    }
    res.status(404).send();
  }).catch((e) => {
    res.status(400).send({message: e.message})
  })
})

// POST /recipe
app.post('/recipe', (req, res) => {
  let body = _.pick(req.body, ['name', 'author', 'description', 'photo', 'ingredients', 'directions', 'tags']);
  let recipe = new Recipe(body);

  // save recipe
  recipe.save().then((recipe) => {
    res.status(200).send('Successfully saved recipe!');
  }).catch((e) => {
    res.status(e.status || 400).send(e);
  })
})

function saveRecipeToUser(recipe) {

}

// GET /recipe/:id
app.get('/recipe/:id', (req, res) => {
  let id = req.params.id;
  console.log('1');

  // if id is not valid
  if(!ObjectID.isValid(id)) {
    console.log('2')
    res.status(400).send({message: 'Recipe ID is invalid'}); // bad request
    return;
  }

  Recipe.findById(id, (err, recipe) => {
    console.log('3');
    if(recipe) {
      console.log('success!');
      res.status(200).send(recipe);
    }
    console.log('not found');
    res.status(404).send();
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  });

  // // find recipe by ID
  // Recipe.findById(id).then((recipe) => {
  //   if(recipe) {
  //     res.send(200).send(recipe);
  //   }
  //   res.status(404).send();
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
})

// PATCH /recipe/edit/:id
app.patch('/recipe/edit/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'author', 'description', 'photo', 'ingredients', 'directions', 'tags']);

  console.log(body);
  console.log("finding recipe");
  if(!ObjectID.isValid(id)) {
    res.status(400).send({message: 'Recipe ID is invalid'}); // bad request
    return;
  }

  // Needs checking, probably pretty shady
  Recipe.update({"_id": ObjectID(id)}, {"$set" : body}, function(err, recipe) {
    if (err) {
      console.log("Error updating recipe: " + err);
      res.send({"error": "An error has occured"});
    }else {
      console.log("recipe updated");
    }
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
