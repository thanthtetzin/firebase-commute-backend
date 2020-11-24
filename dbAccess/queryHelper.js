const {firestoreDb} = require('./firestore');

exports.getDocumentRef = (collectionName, docId) => {
  const documentRef = firestoreDb().collection(collectionName).doc(docId);
  return documentRef;
}
exports.getSearchCollectionQuery = queryParams => {
  if (!queryParams) {
    return null;
  }
  queryParams = JSON.parse(queryParams);
  if (!queryParams.collectionName) {
    return null;
  }

  let query = firestoreDb().collection(queryParams.collectionName);
  if (queryParams.filters.length) {
    queryParams.filters.forEach(filter => {
      if (filter.fieldName && filter.comparisonOperator && filter.value) {
        query = query.where(filter.fieldName, filter.comparisonOperator, filter.value);
      }
    });
  }
  const orderBy = queryParams.orderBy;
  if(orderBy && orderBy.fieldName && orderBy.direction){
    query = query.orderBy(orderBy.fieldName, orderBy.direction)
  }
  if(queryParams.startAfter){
    query = query.startAfter(queryParams.startAfter);
  }
  if(queryParams.endBefore){
    query = query.endBefore(queryParams.endBefore);
  }
  if(queryParams.limit && typeof queryParams.limit === 'number'){
    query = query.limit(queryParams.limit);
  }
  return query;
  
}