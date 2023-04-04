const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

require('dotenv').config()


//Crear el servidor de express

const app = express();


//Base de datos
dbConnection()

//Cors

app.use(cors())

//Puerto
const port = process.env.PORT;


//Directorio Publico

app.use(express.static('public'))

//Lectura y parseo del body
app.use(express.json())


//Rutas
app.use('/api/auth', require('./routes/auth.router'))
app.use('/api/events', require('./routes/events.router'))




app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)

})