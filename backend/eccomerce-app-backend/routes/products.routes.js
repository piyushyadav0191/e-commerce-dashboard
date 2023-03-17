const { Router } = require('express');

const { check } = require('express-validator');

const { 
    getProductsByCategories,
    getProductsSearchEcommerce,
    createProduct,
    getListProducts,
    getProductById,
    updateProduct,
    deleteProduct } = require('../controllers/products.controller');

const { productExists } = require('../helpers/product-exists');

const { jwtValidate,
    isRole } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields.mw');


const router = Router();

/** Only ecommerce */

router.get('/productsByCategories', getProductsByCategories)

router.get('/productsSearchEcommerce/:term', getProductsSearchEcommerce)

/** Ecommerce and dashboard */

router.get('/:term', getListProducts)

router.get('/:id', [
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(productExists),
    validateFields
], getProductById)

router.post('/', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('name', 'Name is required.').not().isEmpty(),
    check('name', 'Min 1 length and max 30 length.').isLength({ min: 1, max: 30 }),
    check('img', 'Img is required.').not().isEmpty(),
    check('category', 'Category is required.').not().isEmpty(),
    validateFields
], createProduct);

router.put('/:id', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(productExists),
    // check('name', 'Name is required.').not().isEmpty(),
    // check('name', 'Min 1 length and max 30 length.').isLength({ min: 1, max: 30 }),
    // check('user', 'User is required.').not().isEmpty(),
    // check('img', 'Img is required.').not().isEmpty(),
    // check('category', 'Category is required.').not().isEmpty(),
    validateFields
], updateProduct)

router.delete('/:id', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(productExists),
    validateFields
], deleteProduct)





module.exports = router;