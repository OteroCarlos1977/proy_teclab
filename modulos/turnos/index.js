const db = require('../../DB/database');
const ctrl = require('./controlador');

module.exports = ctrl(db);