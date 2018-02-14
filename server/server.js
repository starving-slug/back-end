require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

var db = mongoose.connection;
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
  var body = _.pick(req.body, ['email', 'username', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// GET /users/userprofile
app.get('/getUser/:username',(req, res) => {
  var id = req.params['username'];
  var user = {
    name: 'Jeffry Parkins',
    description: 'Hi, I\'m Jeff, and I love to cook food for my friends and family. I have four delicious neices and three scrumptious nephews',
    photo: 'http://i0.kym-cdn.com/entries/icons/mobile/000/025/212/isopodsss.jpg', // url
    recipes: [1203981823, 1028934123, 523523, 1243124135, 15315134134],
    likes: [],
    friends: []
  }
  res.status(200).send(user);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
