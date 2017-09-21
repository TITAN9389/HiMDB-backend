// var mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// module.exports = {mongoose};

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://titan9389:12345@ds131854.mlab.com:31854/hi_mongo', {
    useMongoClient: true
});


module.exports = {mongoose};