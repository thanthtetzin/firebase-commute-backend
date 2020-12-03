# firebase-commute-backend

This project is created with Express.js

## Preparation before running the backend app
- git clone this `firebase-commute-backend` repository
- Copy `serviceAccountKey.json`file and paste inside the project directory
- Run `npm install` at the project directory
- After npm install, run this `export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"`

## Running the backend app
- Run `npm start` (It will start the server by listening to `http://localhost:4000`) 
- `4000` is default port hardcoded at `server.js` file. If you want to change, please feel free to change it first and then run `npm start`


## Testing the backend app
- Run `npm test` to run the simple unit test.
