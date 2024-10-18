

const TABLA = 'pacientes';



module.exports = function(dbInyectada){

    let db = dbInyectada;

    if (!db){
        db = require('../../DB/database');
    }

    function todos(){
        return db.todos(TABLA);
    }
    
    function uno(dni){
        return db.paciente_dni(TABLA, dni);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }
    return {
        todos,
        uno,
        agregar,
        eliminar,
    }
}