const {getSearchCollectionQuery, getDocumentRef} = require('../dbAccess/queryHelper');

const getDocument = exports.getDocument = async (collectionName, docId) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  } 
  else {
    return doc.data();
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
    const doc = await getDocByDocIdForPagination(searchParams.collectionName, searchParams.startAfter, searchParams.orderBy);
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
    const doc = await getDocByDocIdForPagination(searchParams.collectionName, searchParams.startAt, searchParams.orderBy);
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

const getDocByDocIdForPagination = async (collectionName, docId, orderBy) => {
  const docRef = getDocumentRef(collectionName, docId);
  const doc = await docRef.get();
  
  if (doc.exists) {
    // Sometime orderByField is missing in the doc as it can be because of dirty data
    // ** Sample Error Msg **
    // Field “bookingDate” is missing in the provided DocumentSnapshot. Please provide a document that contains values for all specified orderBy() and where() constraints.
    // ** Sample Error Msg **
    // This is some kind of fix to put mock value in order to execute startAfter() startAt() query. (But not 100% sure)
    // if(!doc._fieldsProto[orderBy.fieldName]) {
    //   doc._fieldsProto[orderBy.fieldName] = orderBy.mockValueIfNotFoundInDoc;
    // }
    return doc;
  } 
  else{
    return null;
  } 
}
