// controllers/empaquetadoController.js
const Empaquetado = require('../models/empaquetadoModel');

// Obtener todos los empaquetados
exports.getEmpaquetados = (req, res) => {
    Empaquetado.getAll((err, empaquetados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener empaquetados' });
        }
        res.json(empaquetados);
    });
};

// Crear un nuevo empaquetado
exports.createEmpaquetado = (req, res) => {
    const nuevoEmpaquetado = req.body;
    Empaquetado.create(nuevoEmpaquetado, (err, empaquetado) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear empaquetado' });
        }
        res.status(201).json(empaquetado);
    });
};

// Actualizar un empaquetado
exports.updateEmpaquetado = (req, res) => {
    const { id } = req.params;
    const empaquetadoActualizado = req.body;

    Empaquetado.update(id, empaquetadoActualizado, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar empaquetado' });
        }
        res.json({ message: 'Empaquetado actualizado exitosamente' });
    });
};

// Eliminar un empaquetado
exports.deleteEmpaquetado = (req, res) => {
    const { id } = req.params;

    Empaquetado.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar empaquetado' });
        }
        res.json({ message: 'Empaquetado eliminado exitosamente' });
    });
};
