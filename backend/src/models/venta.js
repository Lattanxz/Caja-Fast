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
    id_lista: {  // Agregando la columna id_lista
      type: DataTypes.INTEGER,
      allowNull: true, // Se puede permitir null si no siempre está asociado
      references: {
        model: "listas", // Relación con la tabla 'listas'
        key: "id_lista",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // El valor se establece a NULL si la lista es eliminada
    },
  },
  {
    tableName: "ventas",
    timestamps: false,
  }
);

module.exports = Venta;
