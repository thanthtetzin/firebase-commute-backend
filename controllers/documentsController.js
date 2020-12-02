const {searchDocuments, getDocument, insertDocument, updateDocument} = require('../services/documents.service');

exports.searchDocuments = async (req, res, next) => {
  try {
    if(req.query && req.query.searchParams){
      const searchParams = JSON.parse(req.query.searchParams);
      if(!searchParams.collectionName){
        return res.status(400).json('At least collectionName should be existed in request query searchParams');
      }
      console.log('searching docs')
      const documents = await searchDocuments(searchParams);
      
      return res.json(documents);
    }
  } catch(error){
    next(error);
  }
}
exports.getDocument = async (req, res, next) => {
  try {
    if(req.params && req.params.collectionName && req.params.docId){
      const doc = await getDocument(req.params.collectionName, req.params.docId);
      return res.json(doc);
    } else {
      return res.status(400).json('Invalid & not enough request parameters');
    }
  } catch(error){
    next(error);
  }
}
exports.insertDocument = async (req, res, next) => {
  try {
    if(req.params && req.params.collectionName && req.body){
      const savedId = await insertDocument(req.params.collectionName, req.body);
      return res.status(201).json(savedId);
    } else {
      return res.status(400).json('Invalid & not enough request parameters');
    }
  } catch(error){
    next(error);
  }
}
exports.updateDocument = async (req, res, next) => {
  try {
    if(req.params && req.params.collectionName && req.params.docId){
      await updateDocument(req.params.collectionName, req.params.docId,  req.body);
      return res.status(201).json(true);
    } else {
      return res.status(400).json('Invalid & not enough request parameters');
    }
  } catch(error){
    next(error);
  }
}
