const {getSearchCollectionQuery, getDocumentRef} = require('../dbAccess/queryHelper');

const getDocument = exports.getDocument = async (collectionName, docId) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } else {
    console.log(doc.data())
    //return doc.data();
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
  if(searchParams.startAfter){
    console.log(searchParams.startAfter)
    const docRef = getDocumentRef(searchParams.collectionName, searchParams.startAfter);
    const doc = await docRef.get();
    // console.log(doc.exists)
    if (doc.exists) {
      console.log(doc.data())
      searchParams.startAfter = doc;

      if(searchParams.startAt){
        delete searchParams.startAt;
      }
    } else{
      return;
    } 
    
  }
  if(searchParams.startAt){
    const docRef = getDocumentRef(searchParams.collectionName, searchParams.startAt);
    const doc = await docRef.get();
    searchParams.startAt = doc;

    if(searchParams.startAfter){
      delete searchParams.startAfter;
    }
  }
  return searchParams;
}