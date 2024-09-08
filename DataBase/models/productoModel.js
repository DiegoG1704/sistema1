// models/productoModel.js
const db = require('../config/db'); // Ajusta la ruta según tu configuración de base de datos

// Crear un nuevo producto
exports.create = (newProduct, callback) => {
    const sql = 'INSERT INTO Producto (nombre, precio, estado) VALUES (?, ?, ?)';
    db.query(sql, [newProduct.nombre, newProduct.precio, newProduct.estado], (err, results) => {
        if (err) return callback(err);
        callback(null, { id: results.insertId, ...newProduct });
    });
};

// Obtener todos los productos
exports.getAll = (callback) => {
    const sql = 'SELECT * FROM Producto';
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Obtener un producto por ID
exports.getById = (id, callback) => {
    const sql = 'SELECT * FROM Producto WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

// Actualizar un producto
exports.update = (id, updatedProduct, callback) => {
    const sql = 'UPDATE Producto SET nombre = ?, precio = ?, estado = ? WHERE id = ?';
    db.query(sql, [updatedProduct.nombre, updatedProduct.precio, updatedProduct.estado, id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Eliminar un producto
exports.delete = (id, callback) => {
    const sql = 'DELETE FROM Producto WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
