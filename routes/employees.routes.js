const { Router } = require('express');
const { check } = require('express-validator');

const { employeeGet, employeesPut, employeesPost, employeesDelete, employeesGet } = require('../controllers/employees.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles'); 

const router = Router();

router.get('/:id', [
    check('id', 'No es un ID válido').isInt(),
    validateJWT,
    isAdminRole
], employeeGet);

router.get("/", [
    validateJWT, 
    isAdminRole
], employeesGet);

router.post('/', [ 
    validateJWT,
    isAdminRole,
    validateFields,
], employeesPost);

router.put('/:id', [    
    check('id', 'No es un ID válido').isInt(),
    validateJWT,
    isAdminRole,
    validateFields,
], employeesPut);

router.delete('/:id', [
    check('id', 'No es un ID válido').isInt(), 
    validateJWT,
    isAdminRole,
], employeesDelete);

module.exports = router;