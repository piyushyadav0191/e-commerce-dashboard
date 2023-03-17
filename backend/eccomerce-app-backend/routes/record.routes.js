const { Router } = require('express');

const { jwtValidate,
    isRole } = require('../middlewares');

const { validateFields } = require('../middlewares/validate-fields.mw');

const { getRecords, recordDelete } = require('../controllers/record.controller');


const router = Router();

router.use(jwtValidate);

router.get('/:term',[
    isRole('ADMIN_ROLE'),
    validateFields
],getRecords)

router.delete('/',[
    isRole('ADMIN_ROLE'),
    validateFields
],recordDelete)

module.exports = router;