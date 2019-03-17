const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		maxlength: [15, 'Username is too long'],
		required: [true, 'Username is required'],
		unique: true
	}
});

UserSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		error.status = 400;
		error.message = 'Username already taken';
		next(error);
	} else {
		next();
	}
});

module.exports = mongoose.model('User', UserSchema);