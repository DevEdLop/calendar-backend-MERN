/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/


const { Router } = require('express');
const { check } = require('express-validator')
const router = Router();

const {
    crearUsuario,
    loginUsuario,
    revalidarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');


router.post('/new',
    [
        check('name', 'Por favor valide el nombre').not().isEmpty(),
        check('email', 'Por favor valide el email').isEmail(),
        check('password', 'El password debe  de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ]
    , crearUsuario)

router.post('/',
    [
        check('email', 'Por favor valide el email').isEmail(),
        check('password', 'El password debe  de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario)


router.get('/renew', validarJwt, revalidarToken)


module.exports = router;