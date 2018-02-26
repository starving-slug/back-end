const mongoose = require('mongoose');
const validator = require('validator');

// {
//   email: 'andrew@example.com',
//   username: 'helloworld',
//   password: 'adpsofijasdfmpoijwerew',
//   tokens: [{
//     access: 'auth',
//     token: 'poijasdpfoimasdpfjiweproijwer'
//   }]
// }

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  first_name: {
    type: String,
    required: true,
    minlength: 1
  },
  last_name: {
    type: String,
    required: true,
    minlength: 1
  },
  // username: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   unique: true,
  //   minlength: 1
  // },
  // tokens: [{
  //   access: {
  //     type: String,
  //     required: true
  //   },
  //   token: {
  //     type: String,
  //     required: true
  //   }
  // }]
});

module.exports = {User}
