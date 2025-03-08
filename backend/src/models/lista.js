const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lista = sequelize.define(
  "Lista",
  {
    id_lista: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_lista: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado_seguridad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // Nombre de la tabla a la que hace referencia
        key: "id_usuario", // Campo en la tabla usuarios
      },
    },
  },
  {
    tableName: "listas",
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: false,
  }
);

module.exports = Lista;

