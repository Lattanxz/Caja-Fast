const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Asegúrate de importar la configuración de la base de datos

const ProductoCaja = sequelize.define(
  "ProductoCaja",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      references: {
        model: "productos", // Relacionar con la tabla productos
        key: "id_producto", // Clave primaria de la tabla productos
      },
    },
    id_caja: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      references: {
        model: "cajas", // Relacionar con la tabla cajas
        key: "id_caja", // Clave primaria de la tabla cajas
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false, // No permitir valores nulos
      defaultValue: 1, // Asignar 1 como valor predeterminado
      validate: {
        min: 0, // Validar que sea mayor o igual a 0
      },
    },
  },
  {
    tableName: "producto_caja", // El nombre de la tabla en la base de datos
    timestamps: false, // Si no tienes campos de fecha como createdAt y updatedAt
  }
);

module.exports = ProductoCaja;
