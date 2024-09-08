// models/usuarioModel.js
const db = require('../config/db'); // Ajusta la ruta según tu configuración de base de datos

// Crear una nueva entrada de usuario
exports.create = (newUser, callback) => {
    const sql = 'INSERT INTO Usuario (username, password) VALUES (?, ?)';
    db.query(sql, [newUser.username, newUser.password], (err, results) => {
        if (err) return callback(err);
        callback(null, { id: results.insertId, ...newUser });
    });
};

// Obtener todos los usuarios
exports.getAll = (callback) => {
    const sql = 'SELECT * FROM Usuario';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Obtener un usuario por ID
exports.getById = (id, callback) => {
    const sql = 'SELECT * FROM Usuario WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

// Obtener un usuario por nombre de usuario
exports.getByUsername = (username, callback) => {
    const sql = 'SELECT * FROM Usuario WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

// Actualizar un usuario
exports.update = (id, updatedUser, callback) => {
    const sql = 'UPDATE Usuario SET username = ?, password = ? WHERE id = ?';
    db.query(sql, [updatedUser.username, updatedUser.password, id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Eliminar un usuario
exports.delete = (id, callback) => {
    const sql = 'DELETE FROM Usuario WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
