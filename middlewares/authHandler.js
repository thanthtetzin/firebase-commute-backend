const admin = require('firebase-admin');

exports.checkAuth =  (req, res, next) => {
  if (req.headers.authtoken) {
    admin.auth().verifyIdToken(req.headers.authtoken)
      .then((result) => {
        console.log('verifyId: ', result.aud, ' ', result.email)
        next()
      }).catch((error) => {
        console.log(error.message)
        res.status(403).send('Unauthorized')
      });
  } else {
    res.status(403).send('Unauthorized')
  }
}
