// models/empaquetadoModel.js
const db = require('../config/db'); // Ajusta la ruta según tu configuración de base de datos

// Crear un nuevo empaquetado
exports.create = (newEmpaquetado, callback) => {
    const sql = 'INSERT INTO Empaquetado (nombre, cantidad) VALUES (?, ?)';
    db.query(sql, [newEmpaquetado.nombre, newEmpaquetado.cantidad], (err, results) => {
        if (err) return callback(err);
        callback(null, { id: results.insertId, ...newEmpaquetado });
    });
};

// Obtener todos los empaquetados
exports.getAll = (callback) => {
    const sql = 'SELECT * FROM Empaquetado';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Obtener un empaquetado por ID
exports.getById = (id, callback) => {
    const sql = 'SELECT * FROM Empaquetado WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

// Actualizar un empaquetado
exports.update = (id, updatedEmpaquetado, callback) => {
    const sql = 'UPDATE Empaquetado SET nombre = ?, cantidad = ? WHERE id = ?';
    db.query(sql, [updatedEmpaquetado.nombre, updatedEmpaquetado.cantidad, id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Eliminar un empaquetado
exports.delete = (id, callback) => {
    const sql = 'DELETE FROM Empaquetado WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
