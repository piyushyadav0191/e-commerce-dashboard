

const dbValidator = require('./db-validator');
const jwtGenerate = require('./jwt-generate');
const GoogleVerify = require('./google-verify');
const fileUploadHelper = require('./upload-file');
const productExists = require('./product-exists');
const categoryExists = require('./category-exists');
const allowedCollections = require('./allowed-collections');


module.exports = {
    ...dbValidator,
    ...jwtGenerate,
    ...GoogleVerify,
    ...fileUploadHelper,
    ...productExists,
    ...categoryExists,
    ...allowedCollections,
}