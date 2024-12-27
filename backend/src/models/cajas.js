const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const Cajas = sequelize.define(
  "Cajas",
  {
    id_caja: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria
      autoIncrement: true, // Auto incremento
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obligatorio
      references: {
        model: "usuarios", // Relación con la tabla usuarios
        key: "id_usuario", // Clave primaria de usuarios
      },
    },
    nombre_caja: {
      type: DataTypes.STRING(100), // Define el tipo y longitud
      allowNull: false, // No puede ser nulo
      validate: {
        len: [3, 100], // Validación de longitud
      },
    },
    descripcion_caja: {
      type: DataTypes.TEXT, // Descripción opcional
      allowNull: true,
    },
    fecha_apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Fecha por defecto como actual
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false, // No puede ser nulo
      defaultValue: true, // Valor por defecto
    },
  },
  {
    tableName: "cajas", // Nombre de la tabla en la base de datos
    timestamps: false, // Usa tus propios campos de fecha
  }
);

module.exports = Cajas;
