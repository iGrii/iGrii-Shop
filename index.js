const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Puerto dinámico para Render

app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');

// Registrar rutas
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use(express.static('public'));

// Iniciar servidor
app.listen(PORT, () => {
  if (process.env.PORT) {
    // Si estamos en Render
    console.log(`✅ Servidor corriendo en Render: ${process.env.RENDER_EXTERNAL_URL || 'URL no definida'}`);
  } else {
    // Si estamos local
    console.log(`✅ Servidor corriendo localmente en http://localhost:${PORT}`);
  }
});
