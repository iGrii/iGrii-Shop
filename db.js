// db.js
const { Pool } = require('pg');

// Configuración de la conexión usando variables de entorno de Render
const pool = new Pool({
  host: process.env.DB_HOST || 'dpg-d423r9re5dus73bdhi8g-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igriishopdb',
  user: process.env.DB_USER || 'igriishopdb_user',
  password: process.env.DB_PASSWORD || 'bgCVZ1FZys73Ul6MDZjKQGXY7WRrAY5X',
  max: 20,                     // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,    // cerrar conexión inactiva después de 30s
  connectionTimeoutMillis: 2000, // tiempo máximo para conectar
  ssl: {
    rejectUnauthorized: false  // necesario para Render
  },
});

// Probar la conexión al iniciar
pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL en Render con SSL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL', err));

module.exports = pool;

