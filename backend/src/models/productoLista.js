const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Asegúrate de importar la configuración de la base de datos

const ProductoLista = sequelize.define(
  "ProductoLista",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      references: {
        model: "productos", // Relacionar con la tabla productos
        key: "id_producto", // Clave primaria de la tabla productos
      },
    },
    id_lista: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Definir este campo como clave primaria
      references: {
        model: "listas", // Relacionar con la tabla listas
        key: "id_lista", // Clave primaria de la tabla listas
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Valor predeterminado en caso de no especificarlo
      validate: {
        min: 0, // Validar que sea mayor o igual a 0
      },
    },
  },
  {
    tableName: "productos_listas", // El nombre de la tabla en la base de datos
    timestamps: false, // No se generan los campos createdAt y updatedAt
  }
);

module.exports = ProductoLista;
