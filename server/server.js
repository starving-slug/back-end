"use strict";

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const Promise = require('bluebird');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');

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
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", "true")
  res.header('Access-Control-Allow-Methods', 'PATCH, POST, GET, DELETE')
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, Access-Control-Allow-Origin, X-Requested-With");
  next();
})

// post user
// authenticates id_token
// creates a new user if username does not exist
// sends back user session token as a cookie with set-cookie
app.post('/users', (req, res) => {
  let token = req.body.id_token;

  console.log("/user running");
  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;

  rp(url)
    .then((body) => {
      let json = JSON.parse(body);

      let profile = new Profile({
        "username": json.email,
        "name": json.name,
        "image": json.image
      });

      let payload = {
        "username": json.email,
        "profile_ID": ""
      }

      let user = new User(payload);

      // check if user already has an account
      User.find({'username': user.username}).exec((err, docs) => {
        // if any user with specified username
        if (docs && docs.length) {
          if (docs[0].profile_ID) {
            // both user and profile exist
            payload.profile_ID = docs[0].profile_ID;

            // create token
            let token = jwt.sign(payload, "asdwerbldsfiuawer", {
              expiresIn: 1440 // expires in 24 hours
            });

            // save token to the database for the user
            User.findOneAndUpdate({username: user.username}, {$set:{token:token}}, function(err, doc){
              if(err){
                  console.log("Something wrong when updating token!");
              }
            });
            
            res.status(200).send({message: "Found user, sending back user session token", newLogin: false, token: token});
          } else {
            // user created but no profile exists
            
            payload.profile_ID = profile.id;
            // create token
            let token = jwt.sign(payload, "asdwerbldsfiuawer", {
              expiresIn: 1440 // expires in 24 hours
            });


            // save token to the database for the user
            User.findOneAndUpdate({username: user.username}, {$set:{token: token, profile_ID: profile.id}}, function(err, doc){
              if(err){
                  console.log("Something wrong when updating token!");
              }
            });

            res.status(200).send({message: "Found user, sending back user session token", newLogin: false, token: token});
          }
        } else {
          // no user with this username found, creating new user

          // create token
          let token = jwt.sign(payload, "asdwerbldsfiuawer", {
            expiresIn: 1440 // expires in 24 hours
          });

          // save token to uesr
          user.token = token;
          user.profile_ID = profile.id;

          profile.save().catch((e) => {
            res.status(400).send({ message: e.message });
          });

          user.save().then((new_user) => {
            res.status(200).send({message: "Successfully created User, sending back user session token", newLogin: false, token: token});
          }).catch((e) => {
            res.status(400).send({ message: e.message });
          });
        }
      });



    }).catch(function (e) {
      // console.log("ID_Token invalid", e.message);
      res.status(400).send({message: e.message});
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

// GET /search
app.get('/search', (req, res) => {
  // Example test:
  // GET localhost:3000/search?author=KevLoi&tag=omega&tag=meat
  // req.query.author = KevLoi
  // req.query.tag = ['omega', 'meat']
  // returns all recipes by author KevLoi that has both tag substrings, omega and Meat
  // or simple a test: GET localhost:3000/search => returns all recipes
  let nameList = setRegex(req.query.name);
  let authorList = setRegex(req.query.author);
  let tagList = setRegex(req.query.tag);

  // Search: { (n1 OR n2 OR ... OR nk) AND (a1 OR a2 OR ... OR ak) AND (tag1 AND tag2 AND ... AND tagk) }
  Recipe.find({'$and': [{'name': nameList}, {'author': authorList}, {'tags': {'$all': tagList}}]}, '_id name author description tags').then((recipes) => {
    console.log(recipes);
    if (recipes) {
      let response = recipes;
      res.status(200).send(response);
    } else if (recipes.length < 1) {console.log("recipe(s) not found");
      res.status(404).send();
    }
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

app.post('/bookmark/:id', (req, res) => {
  console.log(req.params)
  let recipe_id = req.params.id;
  let body = _.pick(req.body, ['username']);
  Recipe.findOne({"_id": ObjectID(recipe_id)}, 'name').then((recipe) => {
    console.log(recipe);

    let query = {username: body.username};
    let update = {bookmarks: [recipe_id]};

    console.log(update);
    Profile.findOneAndUpdate(query, {"$push" : update}).then((profile) => {
      console.log(profile);
      res.status(200).send({message: `Successfully bookmarked recipe id ${recipe_id}`});
    });
  }).catch((e) => {
    console.log(e.message);
    res.status(e.status || 500).send({message: e.message || "There was an error bookmarking " + recipe_id});
  })
})

app.post('/unbookmark/:id', (req, res) => {
  console.log(req.params)
  let recipe_id = req.params.id;
  let body = _.pick(req.body, ['username']);
  Recipe.findOne({"_id": ObjectID(recipe_id)}, 'name').then((recipe) => {
    console.log(recipe);

    let query = {username: body.username};
    let update = {bookmarks: [recipe_id]};

    console.log(update);
    Profile.findOneAndUpdate(query, {"$pull" : update}).then((profile) => {
      console.log(profile);
      res.status(200).send({message: `Successfully bookmarked recipe id ${recipe_id}`});
    });
  }).catch((e) => {
    console.log(e.message);
    res.status(e.status || 500).send({message: e.message || "There was an error bookmarking " + recipe_id});
  })
})

// POST profile
app.post('/setProfile', (req, res) => {
  let token = req.headers.token;
  let profile = req.body;

  // check if user session exists and is valid
  if (token) {
    User.find({'token': token}).exec((err, docs) => {
      // save profile or whatever else 
      if (docs && docs.length) {

        if (!docs[0].profile_ID) {
          // create profile from schema
          let p = new Profile(profile);

          // update profile_ID for user
          User.findOneAndUpdate({email: docs[0].email}, {$set:{profile_ID:p.id}}, function(err, doc){
            if(err){
                console.log("Something wrong when updating profile_ID in user!");
            }
          });

          p.save().then(() => {
            res.status(200).send({message: "Successfully created profile"});
          }).catch((e) => {
            res.status(400).send({ message: "profile creation failed" });
          });
          // and now save profile
        } else {
          // user already has profile and wants to update it
          Profile.findOneAndUpdate({email: docs[0].email}, {$set: profile}, function(err, doc){
            if(err){
                console.log("Something wrong when updating profile!");
            }
            res.status(200).send({message: "Successfully updated profile"});
          });
        }

      }
    }).catch(function (e) {
      res.status(400).send({message: e.message});
    })
  }
})

// PATCH comment
app.patch('/profile-comment/:username', (req, res) => {
  let body = req.body;
  let uname = req.params.username;
  console.log(body);
  console.log(uname);

  Profile.findOneAndUpdate({"username": uname}, {"$set" : {comments: body}}).then((user) => {
    res.status(200).send('Successfully updated profile!');
    console.log("comments updated");
  }).catch((e) => {
    res.status(e.status || 400).send(e);
  });

});

// Get user profile
app.get('/profile/:username', (req, res) => {
  let uname = req.params.username;

  let recipeList = Recipe.find({'author': uname}, '_id name description');
  let profileReq = Profile.findOne({'username': uname}, 'username image description bookmarks comments');

   let promise = Promise.join(recipeList, profileReq, function(recipes, profile) {
     if (profile) {
      console.log(profile);
      let response = {
         username: profile.username,
         description: profile.description,
         image: profile.image,
         recipes: recipes || [],
         bookmarks: profile.bookmarks,
         comments: profile.comments
       }
       res.status(200).send(response);
     } else {
       res.status(404).send();       
     }
   }).catch((e) => {
     res.status(400).send({message: e.message});
   })
})

// POST /recipe
app.post('/recipe', (req, res) => {
  let body = _.pick(req.body, ['name', 'author', 'description', 'photo', 'price', 'ingredients', 'directions', 'tags', 'rating']);
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
    } else {
      console.log('not found');
      res.status(404).send({message: `Recipe ${id} not found`});
    }
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  });
})

// PATCH /recipe/edit/:id
app.patch('/recipe/edit/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'author', 'description', 'photo', 'price', 'ingredients', 'directions', 'tags', 'rating']);

  console.log(body);
  if(!ObjectID.isValid(id)) {
    res.status(400).send({message: 'Recipe ID is invalid'}); // bad request
    return;
  }

  Recipe.findOneAndUpdate({"_id": ObjectID(id)}, {"$set" : body}).then((recipe) => {
    res.status(200).send('Successfully updated recipe!');
    console.log("recipe updated");
  }).catch((e) => {
    res.status(e.status || 400).send(e);
  });
});

// DELETE /recipe/delete/:id
app.delete('/recipe/delete/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);
  if(!ObjectID.isValid(id)) {
    res.status(400).send({message: 'Recipe ID is invalid'}); // bad request
    return;
  }

  Recipe.findByIdAndRemove(id, (err, recipe) => {
    console.log('Deleting recipe');
    if (!err) {
      console.log('success!');
      res.status(200).send(recipe);
    } else {
      console.log('not found');
      res.status(404).send({message: `Recipe ${id} not found`});
    }
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
//
