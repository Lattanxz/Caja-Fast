const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Asegúrate de importar la configuración de la base de datos

const ProductoLista = sequelize.define(
  "ProductoLista",
  {
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      primaryKey: true, 
      references: {
        model: "productos", 
        key: "id_producto", 
      },
    },   
    id_lista: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      primaryKey: true, 
      references: {
        model: "listas", 
        key: "id_lista", 
      },
    },
  },
  {
    tableName: "productos_listas", // El nombre de la tabla en la base de datos
    timestamps: false, // No se generan los campos createdAt y updatedAt
  }
);

module.exports = ProductoLista;
