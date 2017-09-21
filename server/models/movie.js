var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	year:{
		type: Number
	},
	rate:{
		type: Number
	},
	language:{
		type: String,
		required: true
	},
	runtime:{
		type: Number
	},
	description:{
		type: String,
		required: true
	},
	trailer:{
		type: String
	},
	imageurl:{
		type: String,
		required: true
	},
	category:{
		type: String
	},
	updated: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Number,
        default: null
    }

});

var Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};