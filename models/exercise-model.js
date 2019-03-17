const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
	userId: {
		type: String,
		ref: 'User',
		required: [true, 'User ID is required']
	},
	description: {
		type: String,
		required: [true, 'Description is required'],
		maxlength: [140, 'Description is too long']
	},
	duration: {
		type: Number,
		required: true,
		min: [1, 'Duration must be at least 1'],
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} is not an integer value'
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Exercise', ExerciseSchema);