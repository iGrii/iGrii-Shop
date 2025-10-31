const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       // cambia si tu usuario MySQL es otro
  password: '',        // tu contraseña de MySQL
  database: 'igrishop'
});

const promisePool = pool.promise();
module.exports = promisePool;
