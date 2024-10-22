

const TABLA = 'usuarios';
const auth = require('../auth');



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

    function usuarios(){
        return db.usuarios();
    }

    function un_usuario(usuario){
        return db.un_usuario(usuario);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA, body);
    }
    
    async function agregar(body){

        const usuario = {
            id: body.id,
            nombre: body.nombre,
            apellido: body.apellido,
            legajo: body.legajo,
	        email:body.email,
	        rol_id: body.rol_id,

        }

        const respuesta = await db.agregar(TABLA, usuario);

        var insertId = 0;

        if(body.id == 0){
            insertId = respuesta.insertId;
        }else {
            insertId = body.id;
        }

        var respuesta2 = '';

        if(body.usuario || body.password){
            respuesta2 = await auth.agregar({
                id: insertId,
                usuario: body.usuario,
                password:  body.password
            })

        }
        return respuesta2 ;
    }
    return {
        todos,
        uno,
        usuarios,
        un_usuario,
        agregar,
        eliminar,
    }
}