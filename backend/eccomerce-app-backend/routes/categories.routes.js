const { Router } = require('express');

const { check } = require('express-validator');

const { createCategory,
        getListCategories,
        getListCategoriesById,
        updateCategory,
        deleteCategory } = require('../controllers/categories.controller');
        
const { categoryExists } = require('../helpers/category-exists');

const { jwtValidate,
        isRole} = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields.mw');


const router = Router();


router.get('/', getListCategories)

router.get('/:id', [
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], getListCategoriesById)

router.post('/', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('name', 'Name is required.').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('name', 'Name is required.').not().isEmpty(),
    check('id').custom(categoryExists),
    validateFields
], updateCategory)

router.delete('/:id', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    check('id', 'Not a valid mongo id.').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], deleteCategory)


module.exports = router;