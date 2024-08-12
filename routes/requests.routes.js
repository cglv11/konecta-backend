const { Router } = require('express');
const { check } = require('express-validator');

const { requestGet, requestsPost, requestsDelete, requestsGet } = require('../controllers/requests.controller');
// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id', requestGet);

router.get("/", requestsGet);

router.post('/', [
    // validateJWT,
    // validateFields
], requestsPost);

router.delete('/:id', [
    // validateJWT,
    check('id', 'No es un ID válido').isInt(),
    // check('id').custom(existRequestById),
    // validateFields
], requestsDelete);

module.exports = router;
