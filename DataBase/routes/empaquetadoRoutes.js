// routes/empaquetadoRoutes.js
const express = require('express');
const router = express.Router();
const empaquetadoController = require('../controllers/empaquetadoController');

// Ruta para obtener todos los empaquetados
router.get('/', empaquetadoController.getAll);

// Ruta para obtener un empaquetado por ID
router.get('/:id', empaquetadoController.getById);

// Ruta para crear un nuevo empaquetado
router.post('/', empaquetadoController.create);

// Ruta para actualizar un empaquetado
router.put('/:id', empaquetadoController.update);

// Ruta para eliminar un empaquetado
router.delete('/:id', empaquetadoController.delete);

module.exports = router;
