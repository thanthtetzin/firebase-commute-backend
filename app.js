const {searchDocuments, getDocument} = require('./services/documents.service');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(checkAuth);
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err.message);
})

app.get('/documents', async(req, res) => {
  try{
    const documents = await searchDocuments(req.query.searchParams);
    res.json(documents);
  }catch(error){
    console.log(error.message);
  }
});
app.get('/documents/:collectionName/:docId', async (req, res) => {
  const doc = await getDocument(req.params.collectionName, req.params.docId);
  res.json(doc);
})
app.put('/documents/:collectionName/:docId', async (req, res) => {  
  
});
app.post('/documents/:collectionName', async (req, res) => {  
  
});


function checkAuth(req, res, next) {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})