require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body

app.use(express.json());



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

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));




app.listen ( process.env.PORT , () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
} )

