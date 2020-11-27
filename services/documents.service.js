const {getSearchCollectionQuery, getDocumentRef} = require('../dbAccess/queryHelper');

const getDocument = exports.getDocument = async (collectionName, docId) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } else {
    return doc.data();
  }
}
exports.searchDocuments = async searchParams => {
  searchParams = await replaceStartAfterWithActualDoc(searchParams);
  const query = getSearchCollectionQuery(searchParams);
  //console.log(query);
  const documentsResult = await query.get();
  const docs = [];
  documentsResult.forEach(doc => {
    const docToPut = {
      uid: doc.id,
      ...doc.data()
    }
    
    docs.push(docToPut);
  });
  return docs || null;
}

const replaceStartAfterWithActualDoc = async (searchParams) => {
  if (!searchParams) {
    return;
  }
  searchParams = JSON.parse(searchParams);
  if (!searchParams.collectionName) {
    return;
  }
  if(searchParams.lastItemInRows){
    const docRef = getDocumentRef(searchParams.collectionName, searchParams.lastItemInRows);
    const doc = await docRef.get();
    searchParams.startAfter = doc;
  }
  return searchParams;
}