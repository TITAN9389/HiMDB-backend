var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
	title:{
		type: String,
		required: true,
		trim: true,
	},
	year:{
		type: Number
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

module.exports = {Movie};