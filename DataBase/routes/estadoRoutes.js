// routes/estadoRoutes.js
const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController');

// Ruta para obtener todos los estados
router.get('/', estadoController.getAll);

// Ruta para obtener un estado por ID
router.get('/:id', estadoController.getById);

// Ruta para crear un nuevo estado
router.post('/', estadoController.create);

// Ruta para actualizar un estado
router.put('/:id', estadoController.update);

// Ruta para eliminar un estado
router.delete('/:id', estadoController.delete);

module.exports = router;
