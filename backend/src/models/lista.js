const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const Lista = sequelize.define(
  "Lista",
  {
    id_lista: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      autoIncrement: true, // Auto incremento para que se genere automáticamente
    },
    nombre_lista: {
      type: DataTypes.STRING, // Define el nombre de la lista
      allowNull: false, // El nombre no puede ser nulo
    },
    estado_seguridad: {
      type: DataTypes.BOOLEAN, // Define si la lista es privada (true) o pública (false)
      allowNull: false,
      defaultValue: true, // Por defecto, la lista será privada
    },
  },
  {
    tableName: "listas", // El nombre de la tabla en la base de datos
    timestamps: true, // Maneja `createdAt` y `updatedAt` automáticamente
    createdAt: "fecha_creacion", // Mapea `createdAt` a `fecha_creacion`
    updatedAt: false, // No necesitas un campo `updatedAt` en este caso
  }
);

module.exports = Lista;
