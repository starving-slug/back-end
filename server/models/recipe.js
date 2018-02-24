const mongoose = require('mongoose');
const validator = require('validator');

var Recipe = mongoose.model('Recipe', {
  name: {
    type: String,
    require: true,
    trim: true,
    minlength: 1
  },
  author: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: [{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }],
  photo: {
    type: String,
    require: false,
    minlength: 1
  },
  ingredients: [{
    amount: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  directions: [{
    direction: {
      type: String,
      required: true
    }
  }],
  tags: [{
    text: {
      type: String,
      require: true
    },
    path: {
      type: String,
      require: true
    }
  }]
});

module.exports = {Recipe}
