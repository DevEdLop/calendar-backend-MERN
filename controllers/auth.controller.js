const { request, response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario.model')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req = request, res = response) => {

    const { email, password } = req.body


    try {


        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este correo'
            })
        }


        usuario = new Usuario(req.body)


        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save()

        //Generar el jwt
        const token = await generarJWT(usuario.id, usuario.name)


        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })

    }


}

const loginUsuario = async (req = request, res = response) => {

    const { email, password } = req.body


    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con este email'
            })
        }


        // Confirmar los password


        const validPassword = bcrypt.compareSync(password, usuario.password)


        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        // Generar el JWT

        const token = await generarJWT(usuario.id, usuario.name)

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}


const revalidarToken = async (req = request, res = response) => {

    const { uid, name } = req

    // generar un nuevo JWT y retornar en esta peticion
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}