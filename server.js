/* eslint-disable no-console */
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const path  = require('path');
const apiRoute = require(path.join(__dirname, 'routes', 'api-route'));

const app = express();

// Initialize middleware
app.use(cors());	// Avoid the Same Origin Policy thing
app.use(bodyParser.urlencoded({ extended: false }));	// Parse the request body to be a readable json format
app.use(bodyParser.json());

// Connect the backend code with the database
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/exercise-tracker';
const PORT = process.env.PORT || 3000;
const dbOptions = { useNewUrlParser: true, useCreateIndex: true };

mongoose.connect(DB_URI, dbOptions);
const db = mongoose.connection;
db.on('error', err => { console.error('Connection error: ', err); db.close(); });
db.once('open', () => console.log('Connected to the database'));

// Default route
app.get('/', (req, res) => res.sendFile(path.join(__dirname,'views', 'index.html')));

// Set documentation route
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Exercise Tracker',
			version: '1.0.0',
			description: 'RESTful API to track users exercises'
		}
	},
	apis: [path.join(__dirname, 'routes', 'api-route.js')]
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/docs', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

// Handler in case Mongo  goes down
// TYVM cyberwombat https://stackoverflow.com/questions/20689768/how-to-ensure-node-js-keeps-running-after-monogdb-connection-drops
app.use(function(req, res, next) {
	// We lost connection!
	if (1 !== mongoose.connection.readyState) {
		// Reconnect if we can
		mongoose.connect(DB_URI, dbOptions);
		res.status(503);
		throw new Error('Mongo not available');
	}
	next();

});

// Call routes
app.use('/api/exercise', apiRoute);

// Error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		status: err.status || 500,
		message: err.message
	});
});

// Init server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));