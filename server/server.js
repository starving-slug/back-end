"use strict";

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Promise = require('bluebird');
const rp = require('request-promise');

let { mongoose } = require('./db/mongoose');
let { User } = require('./models/user');
let { Recipe } = require('./models/recipe');
let { Profile } = require('./models/profile');


let app = express();
const port = process.env.PORT;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to database!");
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

// POST User
// authenticates id_token
// creates a new user if username does not exist
// sends back user session token
app.post('/users', (req, res) => {
  let token = _.pick(req.body, ['id_token']).id_token;
  let username = _.pick(req.body, ['username']).username;

  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;

  rp(url)
    .then((body) => {
      let json = JSON.parse(body);

      userInfo.email = json.email;
      userInfo.first_name = json.given_name;
      userInfo.last_name = json.family_name;

      let userExist = false;

      let user = new User({
        "email": json.email,
        "username": username,
        "first_name": json.given_name,
        "last_name": json.family_name,
      });

      // check if user exists already
      User.find({ 'username': user.username}).exec((err, docs) => {
        if (docs.length) {
          // user exists
          res.status(200).send("Found user, sending back user session token");
        } else {
          user.save().then((user) => {
            res.status(200).send("Successfully created User, sending back user session token");
          }).catch((e) => {
            res.status(400).send({ message: e.message });
          });
        }
      });

    })
    .catch(function (err) {
      console.log("doesn't work");
    });
});

// get user object given username
app.get('/users/:username', (req, res) => {
  let username = req.params.username;

  User.findOne({ 'username': username }, 'email username first_name last_name').then((user) => {
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send(`${username} not found :(`);
    }
  }).catch((e) => {
    res.status(400).send({ message: e.message });
  });
});

// POST profile
app.post('/setProfile', (req, res) => {
  let body = _.pick(req.body, ['user', 'description', 'image']);
  console.log(body);
  // test user for valid session
  let profile = new Profile({ username: body.user.name, image: body.image, description: body.description });

  profile.save().then((foo) => {
    console.log(foo);
    res.status(200).send({ message: `Successfully saved profile for ${body.user.name}` });
  }).catch((e) => {
    console.log(e.message);
    res.status(400).send({ message: e.message });
  });
})

// Get user profile
app.get('/', (req, res) => {
  let uname = req.params.username;
  let recipeList = Recipe.find({ 'author': uname }, '_id name description');
  let profileReq = Profile.findOne({ 'username': uname }, 'username image description');

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

  Recipe.find({ 'author': uname }, '_id name description').then((recipes) => {
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
    res.status(400).send({ message: e.message })
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
  if (!ObjectID.isValid(id)) {
    console.log('2')
    res.status(400).send({ message: 'Recipe ID is invalid' }); // bad request
    return;
  }

  Recipe.findById(id, (err, recipe) => {
    console.log('3');
    if (recipe) {
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

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
