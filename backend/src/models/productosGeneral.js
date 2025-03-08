const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Asegúrate de importar la configuración de la base de datos

const Productos = sequelize.define(
  "Producto",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }, 
    nombre_producto: {
      type: DataTypes.STRING(100), // Máximo 100 caracteres
      allowNull: false,
      validate: {
        len: [3, 100], // Entre 3 y 100 caracteres
      },
    },
    descripcion_producto: {
      type: DataTypes.STRING(255), // Máximo 255 caracteres
      allowNull: false,
      validate: {
        len: [10, 255], // Entre 10 y 255 caracteres
      },
    },
    precio_producto: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // Evita valores negativos
        isFloat: true, // Asegura que sea un número decimal
      },
    },
  },
  {
    tableName: "productos", // Nombre de la tabla en la base de datos
    timestamps: false, // Si no tienes campos de 'createdAt' y 'updatedAt'
  }
);

module.exports = Productos;
