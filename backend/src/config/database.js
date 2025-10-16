const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,  // Puerto personalizado
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'greatness',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.error('Verifica que MySQL esté corriendo en el puerto:', process.env.DB_PORT || 3307);
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    connection.release();
  }
});

const promisePool = pool.promise();

module.exports = promisePool;
