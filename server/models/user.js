const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

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
		minlength: 8,
		unique: true,
		validate: {
			 validator: validator.isEmail, 
			 //or // (value) => {
			// 	return validator.isEmail(value);
			// },
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}] ,
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