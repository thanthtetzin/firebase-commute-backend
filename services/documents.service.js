const {getSearchCollectionQuery, getDocumentRef} = require('../dbAccess/queryHelper');

exports.getDocument = async (collectionName, docId) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } else {
    return doc.data();
  }
}
exports.searchDocuments = async searchParams => {
  const query = getSearchCollectionQuery(searchParams);
  //console.log(query);
  const documentsResult = await query.get();
  const docs = [];
  documentsResult.forEach(doc => {
    docs.push(doc.data());
  });
  return docs || null;
}