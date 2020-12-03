# firebase-commute-backend

This project is created with Express.js. Node version **v12.19.0**

## Preparation before running the backend app
- git clone this `firebase-commute-backend` repository
- Copy `serviceAccountKey.json`file and paste inside the project directory
- Run `npm install` at the project directory
- After npm install, run this `export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"`

## Running the backend app
- Run `npm start` (It will start the server by listening to `http://localhost:4000`) 
- `4000` is default port hardcoded at `server.js` file. If you want to change, please feel free to change it first and then run `npm start`

## REST API endpoints except 'saving new order', are being used from frontend react app directly.
- To test saving a new order, you could easily use POSTMAN.
- **API Endpoint** : http://localhost:4000/documents/orders
- **Method** : POST
- **Body JSON** 
```
{
    "title": "Meow Booking 4",
    "bookingDate": 1606919835,
    "customer": {
        "email": "thae@gmail.com",
        "name": "Thae",
        "phone": "0997688845"
    },
    "address": {
        "city": "Berlin",
        "country": "Germany",
        "street": "Wriezener Str. 18",
        "zip": "13255"
    }
}
```

- **Headers**
AuthToken : Id_Token (I am logging Id_Token at Frontend browser console for easier access. You can see it after you login to Frontend)

Then, hit **Send**. Cheers!

## Unit Testing the backend app
- Run `npm test` to run the simple unit test.
