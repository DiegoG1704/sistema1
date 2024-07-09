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

// Obtener todos los productos
app.get("/productos", (req, res) => {
    bd.query("SELECT * FROM producto", (err, results) => {
        if (err) {
            console.error("Error obteniendo productos:", err);
            res.status(500).json({ error: "Error obteniendo productos" });
        } else {
            res.json(results);
        }
    });
});

// Obtener un producto por ID
app.get("/productos/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM producto WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo producto:", err);
            res.status(500).json({ error: "Error obteniendo producto" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Crear un nuevo producto
app.post("/productos", (req, res) => {
    const { Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, EstadoId } = req.body;
    bd.query(
        "INSERT INTO producto (Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, EstadoId) VALUES (?, ?, ?, ?, ?, ?)",
        [Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, EstadoId],
        (err, results) => {
            if (err) {
                console.error("Error creando producto:", err);
                res.status(500).json({ error: "Error creando producto" });
            } else {
                res.status(201).json({ id: results.insertId, ...req.body });
            }
        }
    );
});

// Actualizar un producto por ID
app.put('/productos/:id', (req, res) => {
    const id = req.params.id;
    const { Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, EstadoId } = req.body;
  
    const query = `UPDATE producto SET Nombre = ?, PrecioVenta = ?, FechaProduccion = ?, Stock = ?, EmpaquetadoId = ?, EstadoId = ? WHERE Id = ?`;
  
    bd.query(query, [Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, EstadoId, id], (err, results) => {
      if (err) {
        console.error('Error actualizando producto:', err);
        res.status(500).send('Error actualizando producto');
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.status(200).json({ message: 'Producto actualizado correctamente' });
      }
    });
});


// Eliminar un producto por ID
app.delete("/productos/:id", (req, res) => {
    const {id} = req.params;

    const sql = "DELETE FROM producto WHERE Id = ?";
    bd.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        // Verificar si se eliminó correctamente
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "trabajador no encontrado" });
        }

        // Obtener los destinos actualizados después de la eliminación
        bd.query("SELECT * FROM producto", (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            res.json(rows);
        });
    });
});


// Ruta para obtener todos los registros de la tabla Empaquetado
app.get("/empaquetados", (req, res) => {
    const sql = "SELECT * FROM Empaquetado";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de Empaquetado:", err);
            res.status(500).json({ error: "Error al obtener datos de Empaquetado" });
            return;
        }
        res.json(result);
    });
});

// Obtener un producto por ID
app.get("/empaquetados/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM Empaquetado WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo producto:", err);
            res.status(500).json({ error: "Error obteniendo producto" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para obtener todos los registros de la tabla Estado
app.get("/estados", (req, res) => {
    const sql = "SELECT * FROM Estado";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de Estado:", err);
            res.status(500).json({ error: "Error al obtener datos de Estado" });
            return;
        }
        res.json(result);
    });
});

app.get("/estados/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM Estado WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo producto:", err);
            res.status(500).json({ error: "Error obteniendo producto" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Producto no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para obtener todos los registros de la tabla Cliente
app.get("/clientes", (req, res) => {
    const sql = "SELECT * FROM Cliente";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de Cliente:", err);
            res.status(500).json({ error: "Error al obtener datos de Cliente" });
            return;
        }
        res.json(result);
    });
});

app.get("/clientes/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM Cliente WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo Cliente:", err);
            res.status(500).json({ error: "Error obteniendo Cliente" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para obtener todos los registros de la tabla Cliente
app.get("/tiposcomprobantes", (req, res) => {
    const sql = "SELECT * FROM TipoComprobante";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de TipoComprobante:", err);
            res.status(500).json({ error: "Error al obtener datos de TipoComprobante" });
            return;
        }
        res.json(result);
    });
});

app.get("/tiposcomprobantes/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM TipoComprobante WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo TipoComprobante:", err);
            res.status(500).json({ error: "Error obteniendo TipoComprobante" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "TipoComprobante no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para obtener todos los registros de la tabla Cliente
app.get("/TipoPagos", (req, res) => {
    const sql = "SELECT * FROM TipoPago";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de TipoPago:", err);
            res.status(500).json({ error: "Error al obtener datos de TipoPago" });
            return;
        }
        res.json(result);
    });
});

app.get("/TipoPagos/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM TipoPago WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo TipoPago:", err);
            res.status(500).json({ error: "Error obteniendo TipoPago" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "TipoPago no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Crear una nueva venta
app.post("/ventas", (req, res) => {
    const { ProductoId, ClienteId, TipoComprobanteId, TipoPagoId, Cantidad, Total } = req.body;
    const query = "INSERT INTO Venta (ProductoId, ClienteId, TipoComprobanteId, TipoPagoId, Cantidad, Total) VALUES (?, ?, ?, ?, ?, ?)";
    bd.query(query, [ProductoId, ClienteId, TipoComprobanteId, TipoPagoId, Cantidad, Total], (err, result) => {
        if (err) {
            console.error("Error insertando venta:", err);
            res.status(500).json({ error: "Error insertando venta" });
        } else {
            res.status(201).json({ id: result.insertId });
        }
    });
});

// Obtener todas las ventas
app.get("/ventas", (req, res) => {
    const query = "SELECT * FROM Venta";
    bd.query(query, (err, results) => {
        if (err) {
            console.error("Error obteniendo ventas:", err);
            res.status(500).json({ error: "Error obteniendo ventas" });
        } else {
            res.json(results);
        }
    });
});

// Obtener una venta por su ID
app.get("/ventas/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Venta WHERE Id = ?";
    bd.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error obteniendo venta:", err);
            res.status(500).json({ error: "Error obteniendo venta" });
        } else if (result.length === 0) {
            res.status(404).json({ error: "Venta no encontrada" });
        } else {
            res.json(result[0]);
        }
    });
});

// Actualizar una venta por su ID
app.put("/ventas/:id", (req, res) => {
    const { id } = req.params;
    const { ProductoId, ClienteId, TipoComprobanteId, TipoPagoId, Cantidad, Total } = req.body;
    const query = "UPDATE Venta SET ProductoId = ?, ClienteId = ?, TipoComprobanteId = ?, TipoPagoId = ?, Cantidad = ?, Total = ? WHERE Id = ?";
    bd.query(query, [ProductoId, ClienteId, TipoComprobanteId, TipoPagoId, Cantidad, Total, id], (err, result) => {
        if (err) {
            console.error("Error actualizando venta:", err);
            res.status(500).json({ error: "Error actualizando venta" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Venta no encontrada" });
        } else {
            res.json({ message: "Venta actualizada" });
        }
    });
});

// Eliminar una venta por su ID
app.delete("/ventas/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Venta WHERE Id = ?";
    bd.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error eliminando venta:", err);
            res.status(500).json({ error: "Error eliminando venta" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Venta no encontrada" });
        } else {
            res.json({ message: "Venta eliminada" });
        }
    });
});

app.listen(8081, () => {
    console.log("Servidor iniciado en el puerto 8081");
});
