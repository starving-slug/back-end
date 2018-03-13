const mongoose = require('mongoose');
const validator = require('validator');

var Profile = mongoose.model('Profile', {
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
