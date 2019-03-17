const sanitize = require('mongo-sanitize');
const path  = require('path');
const userModel = require(path.join(__dirname, '..', 'models', 'user-model'));

exports.userAdd = (req, res, next) => {

	const newUser = new userModel({ username: sanitize(req.body.username).toLowerCase() });

	newUser.save((err, data) => {
		if (err) return next(err);

		res.json({ username: data.username, _id: data._id });
	});
};

exports.usersList = (req, res, next) => {
	userModel.find({}, '_id username', (err, data) => {
		if (err) return next(err);
		res.json(data);
	});
};