
const { Router } = require('express');
const {
    getEventos,
    crearEvento,
    actualizarEvento,
    elminarEvento } = require('../controllers/events.controller');
const { validarJwt } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const router = Router();


//Todas tienen que pasar por las disque validaciones de no se que vrga
router.use(validarJwt)

//Obtener eventos
router.get('/', getEventos)


//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha inicio es obligatoria').custom(isDate),
        check('end', 'Fecha finilizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento)

//Actualizar Evento
router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha inicio es obligatoria').custom(isDate),
    check('end', 'Fecha finilizacion es obligatoria').custom(isDate),
    validarCampos
], actualizarEvento)

// Borrar evento
router.delete('/:id', elminarEvento)


module.exports = router;