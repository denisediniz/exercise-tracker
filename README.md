# exercise-tracker
RESTful API to track users exercises. Powered with Express, Mongoose and MongoDB. Docs generated with Swagger JSDoc.

## Installation
```bash
$ git clone https://github.com/denisediniz/exercise-tracker.git
$ cd exercise-tracker
$ npm install
```

## Development
```bash
$ npm run dev
```

## Production
```bash
$ npm start
```

## Endpoints
- `/api/exercise/new-user` creates a user
- `/api/exercise/users` lists all the users
- `/api/exercise/add` creates an exercise
- `/api/exercise/log` retrieves an exercise log of any user