// Requerimos express y otros módulos necesarios
const express = require('express');
const config = require('./config');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Nodemailer para el envío de correos electrónicos

const app = express();

var corsOptions = {
    origin: '*',
    optionsSucessStatus: 200
};

// Requerimos las rutas de Pacientes, Turnos, Médicos, Especialidades y Disponibilidad
const pacientes = require('./modulos/pacientes/rutas');
const turnos = require('./modulos/turnos/rutas');
const medicos = require('./modulos/medicos/rutas');
const especialidad = require('./modulos/especialidades/rutas');
const disponibilidad = require('./modulos/disponibilidad_medica/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas')

// Manejo de errores
const error = require('./red/errors');

// Utilización de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Configuración del puerto
app.set('port', config.app.port);

// Configuración del transporter de Nodemailer

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oterocarlosprogramacion@gmail.com', // Reemplazar con tu dirección de correo electrónico
        pass: 'kqeb fags ezcr tjqb', // Reemplazar con tu contraseña de correo electrónico
    },
});

// Endpoint para enviar el email

app.post('/api/enviarEmail', (req, res) => {
    const { to, subject, text } = req.body; // Extraemos los datos de la solicitud

    const mailOptions = {
        from: 'oterocarlosprogramacion@gmail.com', 
        to: to, // Dirección de correo del destinatario
        subject: subject, // Asunto del correo
        text: text, // Contenido del correo
    };

    // Enviamos el correo usando Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error al enviar el correo'); // Respuesta en caso de error
        } else {
            console.log('Email enviado: ' + info.response);
            return res.status(200).send('Correo enviado exitosamente'); // Respuesta en caso de éxito
        }
    });
});

// Configuración de las rutas
// Estas rutas corresponden a los módulos de tu aplicación
app.use('/api/pacientes', pacientes);
app.use('/api/medicos', medicos);
app.use('/api/turnos', turnos);
app.use('/api/especialidad', especialidad);
app.use('/api/disponibilidad', disponibilidad);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use(error);
// Exportamos la instancia de Express configurada
module.exports = app;
