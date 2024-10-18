const database = require('mysql2');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let conexion;

function conectarDB() {
    conexion = database.createConnection(dbconfig);
    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conectarDB);
        }else {
            console.log('Conexión a la base de datos establecida.');
        }
    });
    conexion.on('error', (err) => {
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();
        }else{
            throw err;
        }
    });
};
    
    

    conectarDB();

    function todos(tabla){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla}`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
        
    }
    
    function uno(tabla, id){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function usuario(usuario) {
        return new Promise((resolve, reject) => {
            // Consulta SQL con JOIN
            const sql = `
                SELECT u.nombre, u.apellido
                FROM usuarios u
                JOIN auth a ON u.id = a.id
                WHERE a.usuario = ?`;
    
            // Ejecuta la consulta con el valor del parámetro
            conexion.query(sql, [usuario], (error, result) => {
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function uno_dni(tabla, dni){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE paciente_dni=${dni}`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function uno_medico(tabla, id){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE medico_id=${id} AND (fecha_turno > CURDATE() OR (fecha_turno = CURDATE() AND horario > CURTIME()))`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function uno_especialidad(tabla, id){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE especialidad_id=${id} AND (fecha_turno > CURDATE() OR (fecha_turno = CURDATE() AND horario > CURTIME()))`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function paciente_dni(tabla, dni){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE dni=${dni}`, (error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }

    function disponible(especialidadId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT e.espec AS especialidad, m.id, m.nombre, m.apellido, dia.dia, d.hora_inicio, d.hora_fin 
                FROM especialidad AS e 
                INNER JOIN medicos AS m ON e.id = m.especialidad_id 
                INNER JOIN disponibilidad_medica AS d ON m.id = d.medico_id 
                INNER JOIN dias AS dia ON d.dia_semana = dia.id WHERE e.id = ?;
            `;
            conexion.query(query, [especialidadId], (error, result) => {
                return error ? reject(error) : resolve(result);
            });
        });
    }
    
    
    function agregar(tabla, data){
        return new Promise((resolve, reject)=>{
            conexion.query(`INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data] ,(error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }
    
    
    function eliminar(tabla, data){
        return new Promise((resolve, reject)=>{
            conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, data.id ,(error, result)=>{
                return error ? reject(error) : resolve(result);
            });
        });
    }
    
    function query(tabla, consulta){
        return new Promise((resolve, reject)=>{
            conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta ,(error, result)=>{
                return error ? reject(error) : resolve(result[0]);
            });
        });
    }
    
    
    module.exports = {
        todos, 
        uno,
        usuario,
        uno_dni,
        uno_medico,
        uno_especialidad,
        paciente_dni,
        agregar,
        eliminar,
        query, 
        disponible
    }