const { searchDocuments, getDocument, insertDocument, updateDocument} = require('./controllers/documentsController');
const { basicErrorHandler } = require('./middlewares/errorHandler');
const { checkAuth } = require('./middlewares/authHandler');

const express = require('express');
const cors = require('cors');
const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(checkAuth);
app.use(basicErrorHandler);

app.get('/documents', searchDocuments);
app.get('/documents/:collectionName/:docId', getDocument);

app.put('/documents/:collectionName/:docId', updateDocument);
app.post('/documents/:collectionName', insertDocument);


app.listen(port, () => {
  console.log(`firebase-communte-backend app listening at http://localhost:${port}`)
})