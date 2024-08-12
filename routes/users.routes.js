const { Router } = require('express');
const { check } = require('express-validator');

const { userGet, usersPut, usersPost, usersDelete, usersGet } = require('../controllers/users.controller');
// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id', userGet);

router.get("/", usersGet);

router.post('/', [
    // validateFields
], usersPost);

router.put('/:id', [
    // validateJWT,
    check('id', 'No es un ID válido').isInt(),
    // check('id').custom(existUserById),
    // validateFields
], usersPut);

router.delete('/:id', [
    // validateJWT,
    check('id', 'No es un ID válido').isInt(), 
    // check('id').custom(existUserById),
    // validateFields
], usersDelete);

module.exports = router;
