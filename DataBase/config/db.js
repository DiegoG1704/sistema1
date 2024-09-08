// config/db.js
const mysql = require("mysql");

const bd = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda"
});

bd.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos.");
    }
});

module.exports = bd;
