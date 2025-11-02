require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 CORS: permitir solo ciertos orígenes
app.use(cors({
  origin: [
    'https://igrii-shop.onrender.com', // tu frontend en Render
    'http://localhost:5500'                        // local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔐 Restricción por IP
app.use((req, res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIP = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // Lista de IPs permitidas
const allowedIPs = ['190.236.32.54', '179.6.45.110', '190.237.121.91', '190.238.223.4'];
 // agrega aquí tus IPs permitidas

  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado: IP no autorizada' });
  }
});

// 🔹 Parsear JSON
app.use(bodyParser.json());

// 🔹 Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');

// 🔹 Registrar rutas
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use(express.static('public'));

// 🔹 Endpoint raíz
app.get('/', (req, res) => {
  res.send('✅ API de Tienda funcionando correctamente.');
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  if (process.env.PORT) {
    console.log(`✅ Servidor corriendo en Render: ${process.env.RENDER_EXTERNAL_URL || 'URL no definida'}`);
  } else {
    console.log(`✅ Servidor corriendo localmente en http://localhost:${PORT}`);
  }
});

