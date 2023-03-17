const { Router } = require('express');

const PaymentsController = require('../controllers/payments.controller');
const PaymentsService = require('../services/payments.service');

const PaymentsInstance = new PaymentsController(new PaymentsService());

const {
    validateFields,
    jwtValidate } = require('../middlewares');

const router = Router();

router.post('/', (req, res) => {
    PaymentsInstance.getPaymentLink(req, res);
});

module.exports = router;