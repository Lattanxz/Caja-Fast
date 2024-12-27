const Productos = require("./productosGeneral");
const Cajas = require("./cajas");
const ProductoCaja = require("./productoCaja");
const Usuarios = require("./usuario");

// Definir asociaciones
Usuarios.hasMany(Cajas, {
  foreignKey: "id_usuario",
  sourceKey: "id_usuario",
});

Cajas.belongsTo(Usuarios, {
  foreignKey: "id_usuario",
  targetKey: "id_usuario",
});

Productos.belongsToMany(Cajas, {
  through: ProductoCaja,
  foreignKey: "id_producto",
  otherKey: "id_caja",
});

Cajas.belongsToMany(Productos, {
  through: ProductoCaja,
  foreignKey: "id_caja",
  otherKey: "id_producto",
});

module.exports = { Productos, Cajas, ProductoCaja, Usuarios };
