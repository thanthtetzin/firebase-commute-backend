
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const port = 4000;

const app = express();

app.use(cors());
app.use(express.json());



admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://construyo-coding-challenge.firebaseio.com'
});
const db = admin.firestore();

app.use(checkAuth);
app.get('/users/:uid', async (req, res) => {  
  //const doc = await admin.auth().getUser(req.params.uid);
  const userRef = db.collection('users').doc(req.params.uid);
  const doc = await userRef.get();
  res.json({
    data: doc.data() || null
  })
})
app.get('/orders', async (req, res) => {  
  const ordersRef = db.collection('orders');
  const snapshot = await ordersRef.get();
  const orders = [];
  snapshot.forEach(doc => {
    orders.push(doc.data());
  });
  res.json({
    data: orders || null
  })
})

function checkAuth(req, res, next) {
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
      .then((result) => {
        console.log('verifyId: ', result.aud, ' ', result.email)
        next()
      }).catch(() => {
        res.status(403).send('Unauthorized')
      });
  } else {
    res.status(403).send('Unauthorized')
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})