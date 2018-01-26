var mongoose = require('mongoose');

// cofigures built in mongodb or mongoose promise 
mongoose.Promise = global.Promise;

// connects to either local host or app host
mongoose.connect('mongodb://admin:NGyqgMFVRtGXbejhsB6coggX@ds111568.mlab.com:11568/starvingslugs');


module.exports = {mongoose};