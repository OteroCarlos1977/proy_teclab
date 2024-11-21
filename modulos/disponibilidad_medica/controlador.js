

const TABLA = 'disponibilidad_medica';



module.exports = function(dbInyectada){

    let db = dbInyectada;

    if (!db){
        db = require('../../DB/database');
    }

    function todos(){
        return db.todos(TABLA);
    }
    
    function uno(id){
        return db.uno(TABLA, id);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }

    function uno_medico(id){
        return db.uno_medico(id);
    }
    return {
        todos,
        uno,
        agregar,
        eliminar,
        uno_medico,
    }
}