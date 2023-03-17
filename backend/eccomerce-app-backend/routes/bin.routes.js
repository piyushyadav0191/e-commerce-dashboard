const { Router } = require('express');

const { check } = require('express-validator');
const { userByIdExists } = require('../helpers');

const { productExists } = require('../helpers/product-exists');

const { jwtValidate,
    isRole } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields.mw');

const {
    binGetProducts,
    binEnableProduct,
    binDeleteProduct,
    binGetUsers,
    binEnableUser,
    binDeleteUser } = require('../controllers/bin.controller')


const router = Router();

router.use(jwtValidate);

/* PRODUCTS */

router.get('/products/:term', [
    isRole('ADMIN_ROLE'),
    validateFields
], binGetProducts)

router.put('/products/:id', [
    isRole('ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(productExists),
    validateFields
], binEnableProduct)

router.delete('/products/:id', [
    isRole('ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(productExists),
    validateFields
], binDeleteProduct)

/* USERS */

router.get('/users/:term', [
    isRole('ADMIN_ROLE'),
    validateFields
], binGetUsers);

router.put('/users/:id', [
    isRole('ADMIN_ROLE'),
    check('id', 'It is not a valid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields
], binEnableUser);

router.delete('/users/:id', [
    isRole('ADMIN_ROLE'),
    check('id', 'It is not a valid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields
], binDeleteUser);



module.exports = router;