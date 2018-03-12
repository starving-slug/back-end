const mongoose = require('mongoose');
const validator = require('validator');

var Profile = mongoose.model('Profile', {
  email: {
    type: String,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  username: {
    type: String,
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
    minlength: 1,
  },
  bookmarks: [{
    type: String,
    required: true,
  }],
   comments: [{
    comment: {
      type: String
    },
    author: {
      type: String
    },
    post: {
      type: String
    }
  }]
});

module.exports = {Profile}
