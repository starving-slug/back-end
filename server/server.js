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

// GET /users/:id
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

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};