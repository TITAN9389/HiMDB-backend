const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new Schema({
	username:{
		type: String,
		required: true,
		trim: true,
		minlength: 2
	},
	email:{
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	tokens: {
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	} ,
	age:{
		type: Number,
		required: true,
		minlength: 1,
		trim: true
	},
	favlist:{
		type:[]
	},
	watchlist:{
		type:[]
	}
});

// LIMIT RETURNED DATA
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id','username','email','age','tokens','favlist','watchlist'])
};

// GENERATING AUTH TOKEN FOR EACH USER
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens = ({access, token});

	return user.save().then(() => {
		return token;
	});
};

// DELTE THE SPECIFIC TOKEN
UserSchema.methods.removeToken = function(token) {
	var user = this;

	return user.update({
		$pull : {
			tokens: { token }
		}
	});
};

// FIND USER BY TOKEN WITH VERFICATION
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
	decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

// FIND USER BY CREDENTIALS
UserSchema.statics.findByCredentials = function (email,password){
	var User = this;

	return User.findOne({ email }).then((user) => {
		if (!user){
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
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