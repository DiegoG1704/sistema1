const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");  // Importa multer para manejar archivos
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

// Ruta para registrar un nuevo usuario
app.post("/registro", (req, res) => {
    const { nombreUsuario, correo, contraseña } = req.body;

    if (!nombreUsuario || !correo || !contraseña) {
        return res.status(400).json({ success: false, message: 'Por favor, complete todos los campos' });
    }

    // Verificar si el usuario o correo ya existen
    const checkUserQuery = 'SELECT * FROM Usuario WHERE NombreUsuario = ? OR Correo = ?';
    bd.query(checkUserQuery, [nombreUsuario, correo], (err, results) => {
        if (err) {
            console.error("Error verificando el usuario:", err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'El nombre de usuario o correo ya están en uso' });
        } else {
            const query = 'INSERT INTO Usuario (NombreUsuario, Contraseña, Correo) VALUES (?, ?, ?)';
            bd.query(query, [nombreUsuario, contraseña, correo], (err, result) => {
                if (err) {
                    console.error("Error al registrar el usuario:", err);
                    return res.status(500).json({ success: false, message: 'Error en el servidor' });
                }

                res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
            });
        }
    });
});

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Guardar la imagen con nombre único
    }
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen de perfil
app.post('/Usuario/:id/uploadProfileImage', upload.single('image'), (req, res) => {
    const userId = req.params.id;
    const imagePath = req.file.filename;  // Obtener el nombre del archivo guardado

    // Actualizar la ruta de la imagen en la base de datos
    const query = 'UPDATE Usuario SET fotoPerfil = ? WHERE Id = ?';
    bd.query(query, [imagePath, userId], (err, result) => {
        if (err) {
            console.error("Error actualizando la imagen de perfil:", err);
            res.status(500).send("Error al actualizar la imagen de perfil");
            return;
        }
        res.json({ fotoPerfil: imagePath });  // Enviar solo el nombre del archivo
    });
});

app.get("/productos-vendidos/:usuarioId", (req, res) => {
    const usuarioId = req.params.usuarioId;
    
    const query = `
        SELECT p.Nombre, vp.Cantidad, vp.Precio, v.Fecha
        FROM Producto p
        JOIN VentaProducto vp ON p.Id = vp.ProductoId
        JOIN Venta v ON vp.VentaId = v.Id
        WHERE v.UsuarioId = ?
        ORDER BY v.Fecha DESC;
    `;

    bd.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            res.status(500).json({ error: "Error al obtener los productos vendidos" });
            return;
        }
        res.json(results);
    });
});

app.post("/login", (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ success: false, message: 'Por favor, complete todos los campos' });
    }

    const query = 'SELECT * FROM Usuario WHERE Correo = ?';
    bd.query(query, [correo], (err, results) => {
        if (err) {
            console.error("Error al autenticar el usuario:", err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const user = results[0];
            // Comparar las contraseñas en texto plano
            if (contraseña === user.Contraseña) {
                // Consulta para obtener los productos del usuario
                const productosQuery = `
                    SELECT p.*
                    FROM Producto p
                    INNER JOIN UsuarioProducto up ON p.Id = up.ProductoId
                    WHERE up.UsuarioId = ?
                `;
                bd.query(productosQuery, [user.Id], (err, productos) => {
                    if (err) {
                        console.error("Error al obtener productos del usuario:", err);
                        return res.status(500).json({ success: false, message: 'Error en el servidor' });
                    }

                    res.status(200).json({ 
                        success: true, 
                        message: 'Autenticación exitosa', 
                        usuario: user,
                        productos: productos // Enviar los productos asociados al usuario
                    });
                });
            } else {
                res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
    });
});


// Rutas para productos (sin cambios)
app.get("/productos", (req, res) => {
    bd.query("SELECT * FROM Producto", (err, results) => {
        if (err) {
            console.error("Error getting products:", err);
            return res.status(500).json({ error: "Error getting products" });
        }
        res.json(results);
    });
});

app.get("/usuario/:usuarioId/productos", (req, res) => {
    const { usuarioId } = req.params;
    const query = `
        SELECT p.Id, p.Nombre, p.PrecioVenta, p.FechaProduccion, p.Stock,
        CASE 
            WHEN p.Stock <= 0 THEN 'No Disponible'
            ELSE 'Disponible'
        END AS Estado
        FROM Producto p
        INNER JOIN UsuarioProducto up ON p.Id = up.ProductoId
        WHERE up.UsuarioId = ?
    `;
    bd.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error("Error getting user products:", err);
            return res.status(500).json({ error: "Error getting user products" });
        }
        res.json(results);
    });
});


app.post("/productos", (req, res) => {
    const { Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, UsuarioId } = req.body;

    if (!Nombre || PrecioVenta == null || !FechaProduccion || Stock == null || EmpaquetadoId == null || UsuarioId == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO Producto (Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId)
        VALUES (?, ?, ?, ?, ?)
    `;
    bd.query(query, [Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId], (err, results) => {
        if (err) {
            console.error("Error creating product:", err);
            return res.status(500).json({ error: "Error creating product" });
        }

        const productId = results.insertId;
        // Asociar el producto con el usuario
        const userProductQuery = 'INSERT INTO UsuarioProducto (UsuarioId, ProductoId) VALUES (?, ?)';
        bd.query(userProductQuery, [UsuarioId, productId], (err) => {
            if (err) {
                console.error("Error associating product with user:", err);
                return res.status(500).json({ error: "Error associating product with user" });
            }
            
            res.status(201).json({ id: productId, ...req.body });
        });
    });
});


app.put('/productos/:id', (req, res) => {
    const id = req.params.id;
    const { Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId } = req.body;
    const query = `
        UPDATE Producto
        SET Nombre = ?, PrecioVenta = ?, FechaProduccion = ?, Stock = ?, EmpaquetadoId = ?
        WHERE Id = ?
    `;
    bd.query(query, [Nombre, PrecioVenta, FechaProduccion, Stock, EmpaquetadoId, id], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Error updating product' });
        } else if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
});

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    bd.query('DELETE FROM VentaProducto WHERE ProductoId = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting related records:', err);
            return res.status(500).json({ error: 'Error deleting related records' });
        }
        bd.query('DELETE FROM Producto WHERE Id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Error deleting product' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
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



// Ruta para obtener todos los registros de la tabla Usuario
app.get('/clientes/:usuarioId', (req, res) => {
    const usuarioId = req.params;
    const query = 'SELECT * FROM Cliente WHERE UsuarioId = ?';

    bd.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).json({ error: 'Error al obtener clientes' });
        }
        res.json(results);
    });
});

// Ruta para obtener un usuario específico por su ID
app.get("/Usuario/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM Usuario WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo Usuario:", err);
            res.status(500).json({ error: "Error obteniendo Usuario" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/clientes', (req, res) => {
    const { DNI, Nombre, Apellido, Telefono, Correo, UsuarioId } = req.body;
    
    bd.query("INSERT INTO Cliente (DNI, Nombre, Apellido, Telefono, Correo, UsuarioId) VALUES (?, ?, ?, ?, ?, ?)", 
        [DNI, Nombre, Apellido, Telefono, Correo, UsuarioId], 
        (err, result) => {
            if (err) {
                console.error('Error insertando cliente:', err);
                res.status(500).json({ error: 'Error insertando cliente' });
            } else {
                res.status(201).json({ id: result.insertId });
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

// Ruta para obtener todos los registros de la tabla Cliente
app.get("/VentaProductos", (req, res) => {
    const sql = "SELECT * FROM VentaProducto";
    bd.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener datos de VentaProducto:", err);
            res.status(500).json({ error: "Error al obtener datos de VentaProducto" });
            return;
        }
        res.json(result);
    });
});

app.get("/VentaProductos/:id", (req, res) => {
    const { id } = req.params;
    bd.query("SELECT * FROM VentaProducto WHERE Id = ?", [id], (err, results) => {
        if (err) {
            console.error("Error obteniendo VentaProducto:", err);
            res.status(500).json({ error: "Error obteniendo VentaProducto" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "VentaProducto no encontrado" });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para crear una venta con varios productos
app.post('/ventas', (req, res) => {
    const { clienteId, tipoComprobanteId, tipoPagoId, total, productos, fecha, UsuarioId } = req.body;

    if (!clienteId || !tipoComprobanteId || !tipoPagoId || !productos || productos.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos para realizar la venta' });
    }

    // Iniciar una transacción
    bd.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }

        // Insertar la venta
        const ventaQuery = 'INSERT INTO Venta (ClienteId, TipoComprobanteId, TipoPagoId, Total, Fecha,UsuarioId) VALUES (?, ?, ?, ?, ?, ?)';
        bd.query(ventaQuery, [clienteId, tipoComprobanteId, tipoPagoId, total, fecha, UsuarioId], (err, result) => {
            if (err) {
                return bd.rollback(() => {
                    res.status(500).json({ error: 'Error al insertar la venta' });
                });
            }

            const ventaId = result.insertId;

            // Insertar los productos de la venta
            const ventaProductoQuery = 'INSERT INTO VentaProducto (VentaId, ProductoId, Cantidad, Precio) VALUES ?';
            const ventaProductoData = productos.map(p => [ventaId, p.productoId, p.cantidad, p.precio]);

            bd.query(ventaProductoQuery, [ventaProductoData], (err, result) => {
                if (err) {
                    return bd.rollback(() => {
                        res.status(500).json({ error: 'Error al insertar los productos de la venta' });
                    });
                }

                // Actualizar el stock de los productos
                const stockUpdates = productos.map(p => {
                    return new Promise((resolve, reject) => {
                        const stockQuery = 'UPDATE Producto SET Stock = Stock - ? WHERE Id = ?';
                        bd.query(stockQuery, [p.cantidad, p.productoId], (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(result);
                        });
                    });
                });

                // Ejecutar todas las actualizaciones de stock
                Promise.all(stockUpdates)
                    .then(() => {
                        // Confirmar la transacción
                        bd.commit((err) => {
                            if (err) {
                                return bd.rollback(() => {
                                    res.status(500).json({ error: 'Error al confirmar la transacción' });
                                });
                            }
                            res.status(201).json({ id: ventaId, message: 'Venta realizada con éxito' });
                        });
                    })
                    .catch((err) => {
                        bd.rollback(() => {
                            res.status(500).json({ error: 'Error al actualizar el stock' });
                        });
                    });
            });
        });
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
