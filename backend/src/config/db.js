const { Pool } = require("pg");
require("dotenv").config();

// Configuración del Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then((client) => {
    console.log("Conectado a la base de datos");
    client.release();
  })
  .catch((err) => console.error("Error de conexión a la base de datos", err));

module.exports = pool;
