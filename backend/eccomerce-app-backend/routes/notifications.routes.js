const { Router } = require('express');

const {
    getNotifications,
    updateNotification } = require('../controllers/notifications.controller');

const {
    validateFields,
    jwtValidate } = require('../middlewares');


const router = Router();

router.get('/:page', [
    jwtValidate,
    validateFields
], getNotifications);

router.put('/:id', [
    jwtValidate,
    validateFields
], updateNotification)

module.exports = router;