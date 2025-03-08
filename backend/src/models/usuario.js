const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id_rol",
      },
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "estados",
        key: "id_estado",
      },
    },
    verification_code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    max_cajas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_listas_prod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = {Usuario};
