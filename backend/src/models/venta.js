const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Venta = sequelize.define(
  "Venta",
  {
    id_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_caja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cajas", // Relación con la tabla 'cajas'
        key: "id_caja",
      },
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "metodo_pago", // Relación con la tabla 'metodo_pago'
        key: "id_metodo_pago",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_caja: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_producto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    precio_producto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ventas",
    timestamps: false,
  }
);

module.exports = Venta;