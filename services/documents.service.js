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
  searchParams = await replaceStartAfterStartAtWithActualDoc(searchParams);
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

const replaceStartAfterStartAtWithActualDoc = async (searchParams) => {
  if (!searchParams) {
    return;
  }
  searchParams = JSON.parse(searchParams);
  if (!searchParams.collectionName) {
    return;
  }
  if(searchParams.startAfter){
    console.log(searchParams.startAfter)
    const doc = await getDocByDocIdAndApplyMockSortKeyValIfNotFound(searchParams.collectionName, searchParams.startAfter, searchParams.orderBy);
    if(doc){
      searchParams.startAfter = doc;
      if(searchParams.startAt){
        delete searchParams.startAt;
      }
    }
    else{
      return;
    } 
  }
  if(searchParams.startAt){
    const doc = await getDocByDocIdAndApplyMockSortKeyValIfNotFound(searchParams.collectionName, searchParams.startAt, searchParams.orderBy);
    if(doc){
      searchParams.startAt = doc;
      if(searchParams.startAfter){
        delete searchParams.startAfter;
      }
    }
    else{
      return;
    }
  }

  return searchParams;
}

const getDocByDocIdAndApplyMockSortKeyValIfNotFound = async (collectionName, docId, orderBy) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  
  if (doc.exists) {
    if(!doc._fieldsProto[orderBy.fieldName]) {
      doc._fieldsProto[orderBy.fieldName] = orderBy.mockValueIfNotFoundInDoc;
    }
    return doc;
  } 
  else{
    return null;
  } 
}
