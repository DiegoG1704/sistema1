// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para obtener todos los usuarios
router.get('/', usuarioController.getAll);

// Ruta para obtener un usuario por ID
router.get('/:id', usuarioController.getById);

// Ruta para crear un nuevo usuario
router.post('/', usuarioController.create);

// Ruta para actualizar un usuario
router.put('/:id', usuarioController.update);

// Ruta para eliminar un usuario
router.delete('/:id', usuarioController.delete);

module.exports = router;
