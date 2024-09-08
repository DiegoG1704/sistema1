// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Ruta para obtener todos los productos
router.get('/', productoController.getAll);

// Ruta para obtener un producto por ID
router.get('/:id', productoController.getById);

// Ruta para crear un nuevo producto
router.post('/', productoController.create);

// Ruta para actualizar un producto
router.put('/:id', productoController.update);

// Ruta para eliminar un producto
router.delete('/:id', productoController.delete);

module.exports = router;
