// controllers/productoController.js
const Producto = require('../models/productoModel');

// Obtener todos los productos
exports.getProductos = (req, res) => {
    Producto.getAll((err, productos) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(productos);
    });
};

// Obtener un producto por ID
exports.getProductoById = (req, res) => {
    const { id } = req.params;
    Producto.getById(id, (err, producto) => {
        if (err || !producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    });
};

// Crear un nuevo producto
exports.createProducto = (req, res) => {
    const nuevoProducto = req.body;
    Producto.create(nuevoProducto, (err, producto) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear producto' });
        }
        res.status(201).json(producto);
    });
};

// Actualizar un producto
exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const productoActualizado = req.body;

    Producto.update(id, productoActualizado, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    });
};

// Eliminar un producto
exports.deleteProducto = (req, res) => {
    const { id } = req.params;

    Producto.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    });
};
