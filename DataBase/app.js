// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const db = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const empaquetadoRoutes = require('./routes/empaquetadoRoutes');
const estadoRoutes = require('./routes/estadoRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/productos', productoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/empaquetados', empaquetadoRoutes);
app.use('/estados', estadoRoutes);

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
