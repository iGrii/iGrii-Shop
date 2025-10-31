// db.js
const { Pool } = require('pg'); // Usamos PostgreSQL

const pool = new Pool({
  host: process.env.DB_HOST || 'dpg-d423r9re5dus73bdhi8g-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igriishopdb',
  user: process.env.DB_USER || 'igriishopdb_user',
  password: process.env.DB_PASSWORD || 'bgCVZ1FZys73Ul6MDZjKQGXY7WRrAY5X',
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL en Render'))
  .catch(err => console.error('Error al conectar a PostgreSQL', err));

module.exports = pool;
