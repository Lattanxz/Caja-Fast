// models/Lista.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const MetodoPago = sequelize.define(
  "MetodoPago",
  {
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      autoIncrement: true, // Auto incremento para que se genere automáticamente
    },
    tipo_metodo_pago: {
      type: DataTypes.STRING,
      primaryKey: true, // Definir este campo como clave primaria
      autoIncrement: true, // Auto incremento para que se genere automáticamente
    },
    descripcion: {
      type: DataTypes.TEXT, // Define el nombre de la lista
      allowNull: false, // El nombre no puede ser nulo
    },
  },
  {
    tableName: "metodo_pago", // El nombre de la tabla en la base de datos
    timestamps: false,
  }
);

module.exports = MetodoPago;
