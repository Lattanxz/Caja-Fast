const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const Venta = sequelize.define(
  "Venta",
  {
    id_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria
      autoIncrement: true, // Incremento automático
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false, // Campo obligatorio
      references: {
        model: "usuarios", // Relación con la tabla usuarios
        key: "id_usuario",
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2), // Total de la venta, con dos decimales
      allowNull: false,
      defaultValue: 0.0, // Valor por defecto
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Fecha por defecto como la actual
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ventas", // Nombre de la tabla en la base de datos
    timestamps: false, // No agrega automáticamente createdAt y updatedAt
  }
);

module.exports = Venta;
