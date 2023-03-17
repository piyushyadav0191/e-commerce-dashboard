const validateFields = require('./validate-fields.mw');
const jwtValidate = require('./validate-jwt.mw');
const validateRoles = require('./validate-roles.mw');
const validateFile = require('./validate-file.mw');




module.exports = {
    ...validateFields,
    ...jwtValidate,
    ...validateRoles,
    ...validateFile,
}