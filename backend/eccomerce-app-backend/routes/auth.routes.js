const { Router } = require('express');

const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields.mw');

const { loginController,
        googleSignInController, 
        tokenRevalidate} = require('../controllers/auth.controller');
const { jwtValidate } = require('../middlewares');
  

const router = Router();
 
router.post('/login', [
    check('email', 'Email is required.').isEmail(),
    check('password', 'Password is required.').not().isEmpty(),
    validateFields
], loginController );

router.post('/google', [
    check('id_token', 'id_token is required.').not().isEmpty(),
    validateFields
], googleSignInController );

router.get('/renew', [
    jwtValidate,
    validateFields
], tokenRevalidate );



module.exports = router;