// controllers/usuarioController.js
const Usuario = require('../models/usuarioModel');

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
    Usuario.getAll((err, usuarios) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(usuarios);
    });
};

// Obtener un usuario por ID
exports.getUsuarioById = (req, res) => {
    const { id } = req.params;
    Usuario.getById(id, (err, usuario) => {
        if (err || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    });
};

// Actualizar un usuario
exports.updateUsuario = (req, res) => {
    const { id } = req.params;
    const usuarioActualizado = req.body;

    Usuario.update(id, usuarioActualizado, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    });
};
