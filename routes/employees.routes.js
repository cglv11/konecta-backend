const { Router } = require('express');
const { check } = require('express-validator');

const { employeeGet, employeesPost, employeesGet } = require('../controllers/employees.controller');
// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id', employeeGet);

router.get("/", employeesGet);

router.post('/', [

], employeesPost);

module.exports = router;
