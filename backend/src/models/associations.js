const Productos = require("./productosGeneral");
const Cajas = require("./cajas");
const ProductoLista = require("./productoLista");
const {Usuario} = require("./usuario");
const Lista = require("./lista");
const Venta = require("./venta");
const {MetodoPago} = require("./MetodoPago");
const {Roles} = require("./roles");
const Logs = require("./logs");
const {Estados} = require("./estados");

// Asociación entre Roles y Usuarios
Roles.hasMany(Usuario, {
  foreignKey: "id_rol",
  sourceKey: "id_rol",
  onDelete: "CASCADE",
});
Usuario.belongsTo(Roles, {
  foreignKey: "id_rol",
  targetKey: "id_rol",
});

// Asociación entre Estados y Usuarios
Estados.hasMany(Usuario, {
  foreignKey: "id_estado",
  sourceKey: "id_estado",
  onDelete: "CASCADE",
});
Usuario.belongsTo(Estados, {
  foreignKey: "id_estado",
  targetKey: "id_estado",
});

// Asociación entre Usuarios y Cajas
Usuario.hasMany(Cajas, {
  foreignKey: "id_usuario",
  sourceKey: "id_usuario",
  onDelete: "CASCADE",
});
Cajas.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  targetKey: "id_usuario",
});

// Asociación entre Usuarios y Listas
Usuario.hasMany(Lista, {
  foreignKey: "id_usuario",
  sourceKey: "id_usuario",
  onDelete: "CASCADE",
});
Lista.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  targetKey: "id_usuario",
});

// Asociación entre Cajas y Ventas
Cajas.hasMany(Venta, {
  foreignKey: "id_caja",
  sourceKey: "id_caja",
  onDelete: "CASCADE",
});
Venta.belongsTo(Cajas, {
  foreignKey: "id_caja",
  targetKey: "id_caja",
});

// Asociación entre Ventas y MetodoPago
MetodoPago.hasMany(Venta, {
  foreignKey: "id_metodo_pago",
  sourceKey: "id_metodo_pago",
  onDelete: "CASCADE",
});
Venta.belongsTo(MetodoPago, {
  foreignKey: "id_metodo_pago",
  targetKey: "id_metodo_pago",
});

// Asociación entre Productos y Listas
Productos.belongsToMany(Lista, {
  through: ProductoLista,
  foreignKey: "id_producto",
  otherKey: "id_lista",
  onDelete: "CASCADE",
});
Lista.belongsToMany(Productos, {
  through: ProductoLista,
  foreignKey: "id_lista",
  otherKey: "id_producto",
  onDelete: "CASCADE",
});

// Asociación entre Usuarios y Logs
Usuario.hasMany(Logs, {
  foreignKey: "id_usuario",
  sourceKey: "id_usuario",
  onDelete: "CASCADE",
});
Logs.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  targetKey: "id_usuario",
});

module.exports = { Productos, Cajas, Usuario, Lista, ProductoLista, Venta, MetodoPago, Roles, Logs, Estados };
