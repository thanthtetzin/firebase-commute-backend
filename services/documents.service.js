const {getSearchCollectionQuery, getDocumentRef} = require('../dbAccess/queryHelper');
const {firestoreDb} = require('../dbAccess/firestore');

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

exports.insertDocument = async (collectionName, dataToSave) => {
  const res = await firestoreDb().collection(collectionName).add(dataToSave);
  return res.id;
}

exports.updateDocument = async (collectionName, docId, dataToUpdate) => {
  const docRef = getDocumentRef(collectionName, docId);
  return await docRef.update(dataToUpdate);
}

exports.searchDocuments = async searchParams => {
  searchParams = await replaceStartAfterStartAtWithActualDoc(searchParams);
  const query = getSearchCollectionQuery(searchParams);
  const documentsResult = await query.get();
  const docs = [];
  documentsResult.forEach(doc => {
    const docToPut = doc.data();
    docToPut.docId = doc.id;
    
    docs.push(docToPut);
  });
  return docs || null;
}

const replaceStartAfterStartAtWithActualDoc = async (searchParams) => {
  if (!searchParams) {
    return;
  }
  if (!searchParams.collectionName) {
    return;
  }
  if(searchParams.startAfter){
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
