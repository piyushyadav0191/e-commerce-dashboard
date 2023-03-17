

const allowedCollections = ( collection = '', collectionsP = [] ) => {

    const included = collectionsP.includes( collection );
    
    if( !included ){
        throw new Error(`Collection '${collection}' is not allowed - use '${collectionsP}'`);
    };
    return true;
};



module.exports = {
    allowedCollections
};