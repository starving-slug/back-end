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
  username: {
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
  profile_ID: {
    type: String
  },
  token: {
    type: String
  }
});

module.exports = {User}
