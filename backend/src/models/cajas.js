const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Cajas = sequelize.define(
  "Cajas",
  {
    id_caja: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    nombre_caja: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    descripcion_caja: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    eliminada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "abierto",
    },
  },
  {
    tableName: "cajas",
    timestamps: false,
  }
);

module.exports = Cajas;
