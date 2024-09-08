// models/estadoModel.js
const db = require('../config/db'); // Ajusta la ruta según tu configuración de base de datos

// Crear un nuevo estado
exports.create = (newEstado, callback) => {
    const sql = 'INSERT INTO Estado (nombre) VALUES (?)';
    db.query(sql, [newEstado.nombre], (err, results) => {
        if (err) return callback(err);
        callback(null, { id: results.insertId, ...newEstado });
    });
};

// Obtener todos los estados
exports.getAll = (callback) => {
    const sql = 'SELECT * FROM Estado';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Obtener un estado por ID
exports.getById = (id, callback) => {
    const sql = 'SELECT * FROM Estado WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

// Actualizar un estado
exports.update = (id, updatedEstado, callback) => {
    const sql = 'UPDATE Estado SET nombre = ? WHERE id = ?';
    db.query(sql, [updatedEstado.nombre, id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Eliminar un estado
exports.delete = (id, callback) => {
    const sql = 'DELETE FROM Estado WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
