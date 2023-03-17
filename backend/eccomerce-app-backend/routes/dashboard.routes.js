const { Router } = require('express');

const { 
    getLoggedStatistics, 
    getUnloggedStatistics } = require('../controllers/dashboard.controller');

const {
    validateFields,
    jwtValidate,
    isRole,
} = require('../middlewares');


const router = Router();

router.get('/logged', [
    jwtValidate,
    isRole('MODERATOR_ROLE', 'ADMIN_ROLE'),
    validateFields
], getLoggedStatistics);

router.get('/unlogged', getUnloggedStatistics);

module.exports = router;