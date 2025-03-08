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
  logging: false, 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate(); 
    console.log("Conectado a la base de datos con Sequelize");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }) 
  .then(() => console.log("Tablas sincronizadas con la base de datos"))
  .catch(err => console.error("Error al sincronizar tablas:", err));

module.exports = { sequelize, connectDB };
