const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new Schema({
	username:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
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
	}]
});

// LIMIT RETURNED DATA
AdminSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id','username','email','tokens'])
};

// GENERATING AUTH TOKEN FOR EACH USER
AdminSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
};

// DELTE THE SPECIFIC TOKEN
AdminSchema.methods.removeToken = function(token) {
	var user = this;

	return user.update({
		$pull : {
			tokens: { token }
		}
	});
};

// FIND USER BY TOKEN WITH VERFICATION
AdminSchema.statics.findByToken = function (token) {
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
AdminSchema.statics.findByCredentials = function (email,password){
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
AdminSchema.pre('save', function (next) {
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

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin};