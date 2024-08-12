const { Router } = require('express');
const { check } = require('express-validator');

const { requestGet, requestsPost, requestsDelete, requestsGet } = require('../controllers/requests.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles'); 
const { existEmployeeById } = require('../middlewares/db-validators');

const router = Router();

router.get('/:id', [
    check('id', 'No es un ID válido').isInt(),
    validateJWT,
    validateFields
], requestGet);

router.get("/", [
    validateJWT,
], requestsGet);

router.post('/', [
    validateJWT,
    check('employeeId').custom(existEmployeeById),
    validateFields
], requestsPost);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isInt(),
    validateFields
], requestsDelete);

module.exports = router;
