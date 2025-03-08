const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Logs = sequelize.define(
  "Logs",
  {
    id_log: {
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
    fecha_logueo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_deslogueo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "logs",
    timestamps: false,
  }
);

module.exports = Logs;
