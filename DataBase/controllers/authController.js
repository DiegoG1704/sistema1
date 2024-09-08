// controllers/authController.js
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secretKey = 'mi_clave_secreta';  // Debería estar en un archivo de configuración o variable de entorno

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { username, password: hashedPassword };

        Usuario.create(newUser, (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Inicio de sesión
exports.login = (req, res) => {
    const { username, password } = req.body;

    Usuario.findByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        });
    });
};
