const express = require('express');
const path  = require('path');
const exerciseController = require(path.join(__dirname, '..', 'controllers', 'exercise-controller'));
const userController = require(path.join(__dirname, '..', 'controllers', 'user-controller'));

const router = express.Router();

/**
 * @swagger
 * /api/exercise/new-user:
 *   post:
 *     summary: Creates a user
 *     description: Creates a unique username.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 maximum: 15
 *                 example: "foo"
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Returns an object with username and _id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "foo"
 *                 _id:
 *                   type: string
 *                   description: The database automatically generates an ID
 *                   example: "1a2b3c"
 *       400:
 *         description: Returns a validation error (e.g. username field is missing or already registered)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: 400
 *               message: Username is required
 */
router.post('/new-user', userController.userAdd);

/**
 * @swagger
 * /api/exercise/users:
 *   get:
 *     summary: Lists all the users
 *     description: Returns an array of all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "1a2b3c"
 *                    username:
 *                      type: string
 *                      example: "foo"
*/
router.get('/users', userController.usersList);

/**
 * @swagger
 * /api/exercise/add:
 *   post:
 *     summary: Creates an exercise
 *     description: Adds an exercise to any user
 *     tags:
 *       - Exercises
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Username ID
 *                 example: 1a2b3c
 *               description:
 *                 type: string
 *                 maximum: 140
 *                 example: "running"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 60
 *               date:
 *                 type: string
 *                 format: date
 *                 description: |
 *                   Format: yyyy-mm-dd \
 *                   Default: Date.now()
 *             required:
 *               - userId
 *               - description
 *               - duration
 *     responses:
 *       200:
 *         description: Returns an object with user and exercise fields added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: 1a2b3c
 *                 description:
 *                   type: string
 *                   example: "running"
 *                 duration:
 *                   type: number
 *                   example: 60
 *                 date:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Returns a validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: 400
 *               message: "User ID not found"
*/
router.post('/add', exerciseController.exerciseAdd);

/**
 * @swagger
 * /api/exercise/log:
 *   get:
 *     summary: Retrieve an exercise log of any user
 *     description: Returns a full exercise log of any user with parameters
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID
 *         required: true
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: |
 *           Initial date \
 *           Format: yyyy-mm-dd \
 *           Default: new Date(0)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: |
 *           Final date \
 *           Format: yyyy-mm-dd \
 *           Default: Date.now()
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The numbers of items to return
 *     responses:
 *       200:
 *         description: Returns an object with user, added the array log and count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: 1a2b3c
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 log:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                         example: running
 *                       duration:
 *                         type: integer
 *                         example: 60
 *                       date:
 *                         type: string
 *                         format: date
 *       400:
 *         description: Returns a validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               status: 400
 *               message: Invalid FROM date
*/
router.get('/log', exerciseController.exercisesList);

module.exports = router;
