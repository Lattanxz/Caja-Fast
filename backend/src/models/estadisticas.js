const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Estadisticas = sequelize.define(
  "Estadisticas",
  {
    id_estadistica: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false, // Relaciona la estadística con una venta específica
      references: {
        model: "ventas", // Nombre de la tabla asociada
        key: "id_venta",
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_ventas: {
      type: DataTypes.FLOAT, // Cambiado a FLOAT para manejar montos con decimales
      allowNull: false,
    },
    total_productos_vendidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    porc_metodos_usados: {
      type: DataTypes.JSON, // Almacena información estructurada
      allowNull: false,
    },
  },
  {
    tableName: "estadisticas", // Nombre de la tabla en la base de datos
    timestamps: false, // Deshabilitado para evitar conflicto con `fecha`
  }
);

module.exports = Estadisticas;
