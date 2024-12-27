const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria
      autoIncrement: true, // Incremento automático
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio
      validate: {
        len: [3, 50], // Longitud entre 3 y 50 caracteres
      },
    },
    email_usuario: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio
      unique: true, // Valor único en la base de datos
      validate: {
        isEmail: true, // Validar que sea un correo electrónico válido
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Campo obligatorio
    },
    rol_usuario: {
      type: DataTypes.ENUM("usuario", "administrador"), // Define los roles posibles
      allowNull: false,
      defaultValue: "usuario", // Valor por defecto
    },
  },
  {
    tableName: "usuarios", // Nombre de la tabla en la base de datos
    timestamps: false, // Agrega createdAt y updatedAt automáticamente
  }
);

module.exports = Usuario;
