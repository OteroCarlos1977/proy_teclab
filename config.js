require('dotenv').config();

module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    jwt:{
        secret: process.env.JWT_SECRET || 'clavesecreta',
        
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'mysql-tpfinal.alwaysdata.net',
        user: process.env.MYSQL_USER || 'tpfinal',
        password:  process.env.MYSQL_PASSWORD || '2020Malena',
        database: process.env.MYSQL_DB || 'tpfinal_hospital',
        
    }
}