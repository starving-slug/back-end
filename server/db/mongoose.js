var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:NGyqgMFVRtGXbejhsB6coggX@ds111568.mlab.com:11568/starvingslugs', { useMongoClient: true } );

module.exports = {mongoose};
