const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new Schema({
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
			 validator:  (value) => {
				return validator.isEmail(value);
			 },
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

// RESTRICT RETURNED DATA
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id','name','email','age'])
};

// GENERATING AUTH TOKEN FOR EACH USER
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'qwerty12345').toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
};

// FIND USER BY TOKEN WITH VERFICATION
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
	decoded = jwt.verify(token, 'qwerty12345');
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

// .PRE TO START BEFORE EACH REQUEST
UserSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password , salt ,(err , hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	};
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};