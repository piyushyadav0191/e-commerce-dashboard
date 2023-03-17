const { Router } = require('express');

const { check } = require('express-validator');

const { getSales,
    createSale,
    clearSale,
    updateSale } = require('../controllers/sales.controller');

const {
    validateFields,
    jwtValidate,
    isRole,
} = require('../middlewares');


const router = Router();

router.get('/:term', [
    jwtValidate,
    isRole('ADMIN_ROLE', 'MODERATOR_ROLE'),
    validateFields
], getSales);

router.post('/clear/:email', [
    check('email', 'email is required.').not().isEmpty(),
    validateFields
], clearSale);

router.post('/', [
    jwtValidate,
    validateFields
], createSale);

router.put('/:id', [
    jwtValidate,
    isRole('ADMIN_ROLE', 'MODERATOR_ROLE'),
    check('id', 'id is required.').not().isEmpty(),
    validateFields
], updateSale);

module.exports = router;