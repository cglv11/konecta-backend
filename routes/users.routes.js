const { Router } = require('express');
const { check } = require('express-validator');

const { userGet, usersPut, usersPost, usersDelete, usersGet } = require('../controllers/users.controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateAdminToken } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id', [
    check('id', 'No es un ID válido').isInt(),
    validateAdminToken
], userGet);

router.get("/", validateAdminToken, usersGet);

router.post('/', [ validateAdminToken, validateFields ], usersPost);

router.put('/:id', [    
    check('id', 'No es un ID válido').isInt(),
    validateAdminToken,
    validateFields
], usersPut);

router.delete('/:id', [
    check('id', 'No es un ID válido').isInt(), 
    validateAdminToken,
], usersDelete);

module.exports = router;
