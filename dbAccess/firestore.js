const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://construyo-coding-challenge.firebaseio.com'
});

exports.firestoreDb = () => {
  return admin.firestore();
};
