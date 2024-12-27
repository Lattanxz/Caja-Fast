// db.js (Configurar Sequelize)
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Crear una nueva instancia de Sequelize
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false, // Opcional: si no quieres que muestre las consultas SQL en la consola
});

const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Verificar que la conexión es exitosa
    console.log("Conectado a la base de datos con Sequelize");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

module.exports = { sequelize, connectDB };
