const sql = require('mssql/msnodesqlv8');

const config = {
    server: '(localdb)\\Verdura',
    database: 'EmprendeUDEC',
    driver: 'ODBC Driver 18 for SQL Server',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Error de conexion:', err);
    });

module.exports = {
    sql,
    poolPromise
};