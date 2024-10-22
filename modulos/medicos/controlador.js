

const TABLA = 'medicos';



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

    function disponible(id){
        return db.disponible(id);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    function agregar(body){
        return db.agregar(TABLA, body);
    }

    function medEspec() {
        return db.medicosConEspecialidad(); 
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        disponible,
        medEspec
    }
}