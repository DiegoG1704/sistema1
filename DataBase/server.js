const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const bd = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda"
});

bd.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos.");
});

//------------------------------------------------------------------------------
// CRUD APIs for GastosDiarios
//------------------------------------------------------------------------------
// Obtener todos los gastos diarios
app.get('/gastosDiarios', (req, res) => {
    const sql = 'SELECT * FROM GastoDiario';
    bd.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Agregar un nuevo gasto diario
app.post('/gastosDiarios', (req, res) => {
    const { Fecha } = req.body;
    const sql = 'INSERT INTO GastoDiario (Fecha) VALUES (?)';
    bd.query(sql, [Fecha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId, Fecha });
    });
});

// Eliminar un gasto diario por ID
app.delete('/gastosDiarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM GastoDiario WHERE ID = ?';
    bd.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Gasto diario no encontrado' });
        }
        res.json({ message: 'Gasto diario eliminado exitosamente' });
    });
});
//------------------------------------------------------------------------------
// CRUD APIs for PagoMaterial
//------------------------------------------------------------------------------

// Obtener todos los materiales
app.get('/pagoMaterial', (req, res) => {
    const sql = 'SELECT * FROM PagoMaterial';
    bd.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Obtener un material por ID
app.get('/pagoMaterial/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM PagoMaterial WHERE ID = ?';
    bd.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Material no encontrado' });
        }
        res.json(result[0]);
    });
});

// Agregar un nuevo material
app.post('/pagoMaterial', (req, res) => {
    const { Nombre, Proveedor, UnidadM, Precio, Cantidad } = req.body;
    const sql = 'INSERT INTO PagoMaterial (Nombre, Proveedor, UnidadM, Precio, Cantidad) VALUES (?, ?, ?, ?, ?)';
    bd.query(sql, [Nombre, Proveedor, UnidadM, Precio, Cantidad], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, Nombre, Proveedor, UnidadM, Precio, Cantidad });
    });
});

// Actualizar un material por ID
app.put('/pagoMaterial/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre, Proveedor, UnidadM, Precio, Cantidad } = req.body;
    const sql = 'UPDATE PagoMaterial SET Nombre = ?, Proveedor = ?, UnidadM = ?, Precio = ?, Cantidad = ? WHERE ID = ?';
    bd.query(sql, [Nombre, Proveedor, UnidadM, Precio, Cantidad, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Material no encontrado' });
        }
        res.json({ id, Nombre, Proveedor, UnidadM, Precio, Cantidad });
    });
});

// Eliminar un material por ID
app.delete('/pagoMaterial/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM PagoMaterial WHERE ID = ?';
    bd.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Material no encontrado' });
        }
        res.json({ message: 'Material eliminado exitosamente' });
    });
});


app.listen(8081, () => {
    console.log("Servidor iniciado en el puerto 8081");
});
