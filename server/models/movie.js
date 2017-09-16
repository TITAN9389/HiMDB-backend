var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
	title:{
		type: String,
		required: true,
		trim: true,
	},
	rate:{
		type: Number,
		required: true,
		maxlength: 1,
		trim: true
	},
	language:{
		type: String
	},
	runtime:{
		type: Number
	},
	description:{
		type: String
	},
	trailer:{
		type: String
	},
	imageurl:{
		type: String
	}
});

var Movie = mongoose.model('Movie', movieSchema);

// var troy = new Movie ({
// 	title : 'Troy',
// 	language: 'English',
// 	rate: 9,
// 	runtime: 98,
// 	description: 'The Greatest Movie of all times specially ACHILLES',
// 	imageurl: 'http://resizing.flixster.com/BhPgVtxAY9IUr1wiDvKkC5K24MI=/800x1200/v1.bTsxMTE2NjczMztqOzE3NTcyOzIwNDg7ODAwOzEyMDA'
// });

// troy.save().then((doc) => {
// 	console.log('Added movie', doc);
// }, (e) => {
// 	console.log('Unable to Add', e);
// });

module.exports = {Movie};