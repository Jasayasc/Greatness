const express = require('express');
const cors = require('cors');

const personaRoutes = require('./routes/personaRoutes');
const mensualidadRoutes = require('./routes/mensualidadRoutes');
const valoracionRoutes = require('./routes/valoracionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/personas', personaRoutes);
app.use('/api/mensualidades', mensualidadRoutes);
app.use('/api/valoraciones', valoracionRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = app;
