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
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio_producto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    descripcion_producto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "productos", // Nombre de la tabla en la base de datos
    timestamps: false, // Si no tienes campos de 'createdAt' y 'updatedAt'
  }
);

module.exports = Productos;
