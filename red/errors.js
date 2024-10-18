const respuesta = require('./respuestas');

function errors(err, req, res, next) {
    console.error('[error]', err);

    const message = err.message || 'Error Interno';
    const status = err.statuCode || 500;

    respuesta.error(req, res, message, status);
}

module.exports = errors;