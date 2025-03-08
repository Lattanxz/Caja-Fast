const { sequelize } = require("./config/db");
const { initializeEstados } = require("./models/estados");
const { initializeRoles } = require("./models/roles");
const { initializeMetodoPago } = require("./models/MetodoPago");

// Importar modelos
const {Roles} = require("./models/roles");
const {Estados} = require("./models/estados");
const {Usuario} = require("./models/usuario");
const {MetodoPago} = require("./models/MetodoPago");
const Cajas = require("./models/cajas");
const Lista = require("./models/lista");
const ProductosGeneral = require("./models/productosGeneral");
const ProductoLista = require("./models/productoLista");
const Venta = require("./models/venta");
const Logs = require("./models/logs");

// Importar asociaciones
require("./models/associations");

async function syncDatabase() {
  try {
    // Sincronizar tablas sin dependencias primero
    await Roles.sync({ alter: true });
    console.log("✅ Tabla Roles sincronizada");

    await initializeRoles();

    await Estados.sync({ force: true });
    console.log("✅ Tabla Estados sincronizada");

    // Inicializar los estados después de sincronizar la tabla
    await initializeEstados();
    console.log("✅ Estados inicializados correctamente");

    await MetodoPago.sync({ force: true });
    console.log("✅ Tabla MetodoPago sincronizada");
    await initializeMetodoPago();
    // Sincronizar tablas con dependencias después
    await Usuario.sync({ force: true });
    console.log("✅ Tabla Usuarios sincronizada");

    await Cajas.sync({ force: true });
    console.log("✅ Tabla Cajas sincronizada");

    await Lista.sync({ force: true });
    console.log("✅ Tabla Lista sincronizada");

    await ProductosGeneral.sync({ force: true });
    console.log("✅ Tabla Productos sincronizada");

    await ProductoLista.sync({ force: true });
    console.log("✅ Tabla ProductoLista sincronizada");

    await Venta.sync({ force: true });
    console.log("✅ Tabla Venta sincronizada");

    await Logs.sync({ force: true });
    console.log("✅ Tabla Logs sincronizada");

    console.log("✅ Sincronización completada con éxito");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
}

syncDatabase();