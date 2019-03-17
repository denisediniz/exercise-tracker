const sanitize = require('mongo-sanitize');
const moment = require('moment');
const path  = require('path');
const exerciseModel = require(path.join(__dirname, '..', 'models', 'exercise-model'));
const userModel = require(path.join(__dirname, '..', 'models', 'user-model'));

let isValidDate = element => moment(sanitize(element), 'YYYY-MM-DD', true).format();

exports.exerciseAdd = (req, res, next) => {
	const userId = sanitize(req.body.userId);
	const userDate = (req.body.date === undefined) ? moment().toISOString() : (isValidDate(req.body.date) === 'Invalid date') ? 'Invalid date' : moment(sanitize(req.body.date)).toISOString();

	if (userId === '') return next({ status: 400, message: 'User ID is required' });
	if (userDate === 'Invalid date') return next({ status: 400, message: 'Invalid date' });

	userModel.findById(userId, (err, user) => {
		if (err) {
			if (!user) {
				next({ status: 400, message: 'User ID not found' });
			}
			next(err);
		}

		const exerciseReq = {
			userId: sanitize(req.body.userId),
			description: sanitize(req.body.description),
			duration: Number(sanitize(req.body.duration)),
			date: userDate
		};

		const newExercise = new exerciseModel(exerciseReq);

		newExercise.save((err, saveExercise) => {
			if (err) return next(err);
			saveExercise = saveExercise.toObject();
			delete saveExercise._id;
			delete saveExercise.__v;
			res.json(saveExercise);
		});
	});
};

exports.exercisesList = (req, res, next) => {
	const userId = String(sanitize(req.query.userId));
	const limitQuery = Number(sanitize(req.query.limit));

	const ltDate = (req.query.to === undefined) ? moment().toISOString() : (isValidDate(req.query.to) === 'Invalid date') ? 'Invalid date' : moment(sanitize(req.query.to)).toISOString();
	const gtDate = (req.query.from === undefined) ? moment(0).toISOString() : (isValidDate(req.query.from) === 'Invalid date') ? 'Invalid date' : moment(sanitize(req.query.from)).toISOString();

	if (ltDate === 'Invalid date') return next({ status: 400, message: 'Invalid TO date' });
	if (gtDate === 'Invalid date') return next({ status: 400, message: 'Invalid FROM date' });

	userModel.findById(userId, (err, user) => {
		if (err) {
			if (!user) {
				next({ status: 400, message: 'User ID not found' });
			}
			next(err);
		}

		exerciseModel.find({
			userId: userId,
			date: {
				'$lt': ltDate,
				'$gt': gtDate
			}
		}, '-_id -__v -userId')
			.sort('-date')
			.limit(limitQuery)
			.exec((err, exercises) => {
				if (err) return next(err);

				const convertDate = obj => {
					obj = obj.toObject();
					obj.date = moment(obj.date).format('YYYY-MM-DD');
					return obj;
				};

				const listExercises = {
					username: user.username,
					count: exercises.length,
					log: exercises.map(exercise => convertDate(exercise))
				};

				res.json(listExercises);
			});
	});
};