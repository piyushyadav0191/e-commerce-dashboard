const { Router } = require('express');

const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields.mw');

const { fileUpload,
        showImg,
        updateUserImgCloudinary } = require('../controllers/uploads.controller');

const { allowedCollections } = require('../helpers');
const { validateFile,
        jwtValidate, 
        isRole} = require('../middlewares');


const router = Router();

router.use( jwtValidate );


router.post('/', [
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    validateFile,
    validateFields
], fileUpload );

router.put('/:collection/:id', [
    validateFile,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], updateUserImgCloudinary );

router.get('/:collection/:id', [
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
], showImg)


module.exports = router;