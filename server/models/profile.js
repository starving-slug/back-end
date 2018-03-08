const mongoose = require('mongoose');
const validator = require('validator');

var Profile = mongoose.model('Profile', {
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    minlength: 1
  },
  name: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true,
    minlength: 6
  },
  description: {
    type: String,
    require: false,
    minlength: 1
  }
});

module.exports = {Profile}
