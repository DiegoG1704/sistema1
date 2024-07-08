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

app.listen(8081, () => {
    console.log("Servidor iniciado en el puerto 8081");
});
