var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Starvingslugs database
mongoose.connect('mongodb://admin:NGyqgMFVRtGXbejhsB6coggX@ds111568.mlab.com:11568/starvingslugs', { useMongoClient: true } );

// test database
// mongoose.connect('mongodb://admin:helloWorld123@ds012578.mlab.com:12578/back-end-test', { useMongoClient: true } );

module.exports = {mongoose};
