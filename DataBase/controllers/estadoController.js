// controllers/estadoController.js
const Estado = require('../models/estadoModel');

// Obtener todos los estados
exports.getEstados = (req, res) => {
    Estado.getAll((err, estados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener estados' });
        }
        res.json(estados);
    });
};

// Crear un nuevo estado
exports.createEstado = (req, res) => {
    const nuevoEstado = req.body;
    Estado.create(nuevoEstado, (err, estado) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear estado' });
        }
        res.status(201).json(estado);
    });
};

// Actualizar un estado
exports.updateEstado = (req, res) => {
    const { id } = req.params;
    const estadoActualizado = req.body;

    Estado.update(id, estadoActualizado, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar estado' });
        }
        res.json({ message: 'Estado actualizado exitosamente' });
    });
};

// Eliminar un estado
exports.deleteEstado = (req, res) => {
    const { id } = req.params;

    Estado.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar estado' });
        }
        res.json({ message: 'Estado eliminado exitosamente' });
    });
};
