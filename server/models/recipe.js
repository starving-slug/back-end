const mongoose = require('mongoose');
const validator = require('validator');

var Recipe = mongoose.model('Recipe', {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  photo: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    required: false
  },
  ingredients: [{
    amount: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: true
    }
  }],
  directions: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    required: true
  }]
});

module.exports = {Recipe}
