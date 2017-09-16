var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name:{
		type: String,
		required: true,
		trim: true,
		minlength: 2
	},
	email:{
		type: String,
		required: true,
		trim: true,
		minlength: 8
	},
	age:{
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	}
});

var User = mongoose.model('User', userSchema);

// var seb = new User({
// 	name : 'Seb',
// 	email: 'titan9389@me.com',
// 	age: 24
// });

// seb.save().then((doc) => {
// 	console.log('Added user', doc);
// }, (e) => {
// 	console.log('Unable to Add', e);
// });

module.exports = {User};