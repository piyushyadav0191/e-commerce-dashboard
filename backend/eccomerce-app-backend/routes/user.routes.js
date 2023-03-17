const { Router } = require('express');

const { check } = require('express-validator');

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateCartUser,
    deleteCartUser} = require('../controllers/users.controller');

const { 
    isRoleValid,
    emailExists,
    userByIdExists } = require('../helpers/db-validator');

const {
    validateFields,
    jwtValidate,
    isRole,
} = require('../middlewares');



const router = Router();


router.get('/:term', jwtValidate, getUsers);

router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('password', 'Password most be at least of 6 lenght.').isLength({ min: 6 }),
    check('email', 'The email is not valid').isEmail(),
    check('email').custom(emailExists),
    check('role').custom(isRoleValid),
    validateFields
], createUser);

router.put('/:id', [
    jwtValidate,
    check('id', 'It is not a valid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    check('role').custom(isRoleValid),
    validateFields
], updateUser);


router.delete('/:id', [
    jwtValidate,
    isRole('ADMIN_ROLE', 'MODERATOR_ROLE'),
    check('id', 'It is not a valid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields
], deleteUser);

router.put('/cart/:id', [
    jwtValidate,
    check('id', 'It is not a valid mongo id.').isMongoId(),
    validateFields
], updateCartUser);

router.delete('/cart/:userId/:productId', [
    jwtValidate,
    check('userId', 'It is not a valid mongo id.').isMongoId(),
    check('productId', 'It is not a valid mongo id.').isMongoId(),
    validateFields
], deleteCartUser);

module.exports = router;