const { request, response } = require('express');
const Evento = require('../models/Event.model')

const getEventos = async (req = request, res = response) => {

    const evento = await Evento.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        evento
    })
}
const crearEvento = async (req = request, res = response) => {

    const evento = new Evento(req.body);

    console.log(evento)

    try {


        evento.user = req.uid;
        const eventoSave = await evento.save()

        res.json({
            ok: true,
            evento: eventoSave
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hablde con el administrador'
        })
    }

}
const actualizarEvento = async (req = request, res = response) => {


    const eventId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById(eventId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found with id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventId, nuevoEvento, { new: true })

        res.json({
            ok: true,
            evento: eventoActualizado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const elminarEvento = async (req = request, res = response) => {

    const eventId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById(eventId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found with id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }


        await Evento.findByIdAndDelete(eventId)

        return res.json({
            ok: true,
            msg: 'Evento Eliminado Correctamente'
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    elminarEvento
}