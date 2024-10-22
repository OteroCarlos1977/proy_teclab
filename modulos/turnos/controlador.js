

const TABLA = 'turnos';



module.exports = function(dbInyectada){

    let db = dbInyectada;

    if (!db){
        db = require('../../DB/database');
    }

    function especialidad(){
        return db.especialidad(TABLA);
    }
    
    function uno(dni){
        return db.uno_dni(TABLA, dni);
    }

    function uno_medico(id){
        return db.uno_medico(TABLA, id);
    }

    function uno_especialidad(id){
        return db.uno_especialidad(TABLA, id);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }
    return {
        especialidad,
        uno,
        agregar,
        eliminar,
        uno_medico,
        uno_especialidad,
    }
}