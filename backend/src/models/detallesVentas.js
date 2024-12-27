const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const DetallesVentas = sequelize.define(
  "DetallesVentas",
  {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria única para cada detalle
      autoIncrement: true, // Generado automáticamente
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ventas", // Relación con la tabla ventas
        key: "id_venta",
      },
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos", // Relación con la tabla productos
        key: "id_producto",
      },
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "metodos_pago", // Relación con la tabla métodos de pago
        key: "id_metodo_pago",
      },
    },
    nombre_producto: {
      type: DataTypes.STRING(100), // Longitud máxima de 100 caracteres
      allowNull: false,
    },
    precio_producto: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // No debe permitir valores negativos
      },
    },
    descripcion_producto: {
      type: DataTypes.TEXT, // Tipo TEXT en lugar de STRING para descripciones largas
      allowNull: true, // Opcional
    },
  },
  {
    tableName: "detalle_ventas", // Nombre de la tabla en la base de datos
    timestamps: false, // No requiere createdAt ni updatedAt
  }
);

module.exports = DetallesVentas;
