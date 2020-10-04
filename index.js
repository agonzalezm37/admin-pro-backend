require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());


// Base de datos

dbConnection();

// user: antonio
// pw: antonio

app.get('/', (req, res) => {
    res.status(400).json({
        ok:true,
        msg: 'Hola mundo'
    })
});



app.listen ( process.env.PORT , () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
} )

