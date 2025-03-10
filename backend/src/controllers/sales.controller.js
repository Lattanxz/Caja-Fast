const pool = require("../config/db");
const Venta = require("../models/venta");
const Producto = require("../models/productosGeneral");
const Caja = require("../models/cajas");
const { MetodoPago } = require("../models/MetodoPago");
const { sequelize } = require("../config/db");

// Añadir producto vendido
const addProductToSale = async (req, res) => {
  const { id_producto, cantidad, id_metodo_pago, id_caja, nombre_caja, id_lista } = req.body; // <-- Agrega id_lista

  try {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    const subtotal = producto.precio_producto * Number(cantidad);

    const venta = await Venta.create({
      id_caja: id_caja,
      id_metodo_pago: id_metodo_pago,
      cantidad: cantidad,
      nombre_caja: nombre_caja,
      nombre_producto: producto.nombre_producto,
      precio_producto: subtotal,
      fecha_venta: new Date(),
      id_lista: id_lista, // <-- Aquí se agrega id_lista a la venta
    });

    if (!venta) {
      return res.status(500).json({ mensaje: "Error al crear la venta." });
    }

    return res.status(200).json({
      mensaje: "Producto agregado correctamente a la venta.",
      venta,
    });
  } catch (err) {
    console.error("Error al agregar el producto a la venta:", err);
    return res.status(500).json({ mensaje: "Error al agregar el producto.", error: err.message });
  }
};

const getSalesByCaja = async (req, res) => {
  try {
    const { id_caja } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 30;
    const offset = (page - 1) * pageSize;

    const ventas = await Venta.findAll({
      where: { id_caja },
      limit: pageSize,
      offset,
      order: [["fecha_venta", "DESC"]],
    });

    const ventasFiltradas = ventas.filter((venta) => venta.nombre_producto);

    res.json(ventasFiltradas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

const updateSale = async (req, res) => {
  const { id_venta } = req.params;
  const { id_producto, cantidad, id_metodo_pago } = req.body;

  try {
    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    const subtotal = producto.precio_producto * Number(cantidad);

    const venta = await Venta.findByPk(id_venta);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada." });
    }

    venta.id_producto = id_producto;
    venta.cantidad = cantidad;
    venta.id_metodo_pago = id_metodo_pago;
    venta.precio_producto = subtotal;
    venta.nombre_producto = producto.nombre_producto;

    await venta.save();

    res.status(200).json({ mensaje: "Venta actualizada correctamente", venta });
  } catch (err) {
    console.error("Error al actualizar la venta:", err);
    res.status(500).json({ mensaje: "Error al actualizar la venta.", error: err.message });
  }
};

const deleteSale = async (req, res) => {
  const { id_venta } = req.params;

  try {
    const venta = await Venta.findByPk(id_venta);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada." });
    }

    await venta.destroy();
    res.status(200).json({ mensaje: "Venta eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar la venta:", err);
    res.status(500).json({ mensaje: "Error al eliminar la venta.", error: err.message });
  }
};

const getStatistics = async (req, res) => { 
  console.log("Petición a /api/sales/statistics:", req.originalUrl, req.query);
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el parámetro id_usuario" });
  }

  try {
    console.log("Obteniendo total de ventas...");
    const totalVentas = await Venta.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.literal("COALESCE(precio_producto, 0)")), "totalVentas"], 
      ],
      include: [{
        model: Caja,
        as: 'Caja',
        where: { id_usuario },
        required: true,  
      }],
      group: ['Caja.id_caja'],  
      raw: true,
    });

    const totalVentasValue = totalVentas.reduce((acc, venta) => acc + Number(venta.totalVentas), 0);
    console.log("Total de ventas obtenido:", totalVentasValue);

    console.log("Obteniendo productos vendidos...");
    const productosVendidosData = await Venta.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.literal("COALESCE(cantidad, 0)")), "totalProductos"]
      ],
      include: [{
        model: Caja,
        as: 'Caja',
        where: { id_usuario },
        required: true,  
      }],
      group: ['Caja.id_caja'],  
      raw: true,
    });

    // Sumar todas las cantidades de productos vendidos
    const productosVendidos = productosVendidosData.reduce((acc, item) => acc + Number(item.totalProductos), 0);
    console.log("Productos vendidos obtenidos:", productosVendidos);

    console.log("Obteniendo cajas cerradas...");
    const cajasCerradas = await Caja.count({   
      where: { estado: "cerrado", id_usuario },
      raw: true,
    });
    console.log("Cajas cerradas obtenidas:", cajasCerradas);

    res.json({
      totalVentas: totalVentasValue,
      productosVendidos,
      cajasCerradas,
    });
  } catch (error) {
    console.error("Error en getStatistics:", error.message, error.stack);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};


const getRevenueByDate = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    const revenueData = await Venta.findAll({
      attributes: [
        [
          sequelize.literal(`DATE("Caja"."fecha_apertura" AT TIME ZONE 'UTC')`), 
          "fecha"
        ],
        [sequelize.fn("SUM", sequelize.col("precio_producto")), "totalRecaudado"],
      ],
      include: [
        {
          model: Caja,
          attributes: [],
          where: { id_usuario },
        },
      ],
      group: [sequelize.literal(`DATE("Caja"."fecha_apertura" AT TIME ZONE 'UTC')`)],
      order: [[sequelize.literal(`DATE("Caja"."fecha_apertura" AT TIME ZONE 'UTC')`), "ASC"]],
    });

    res.json({
      revenueByDate: revenueData.map(item => ({
        fecha: item.dataValues.fecha, 
        totalRecaudado: parseFloat(item.dataValues.totalRecaudado).toFixed(2),
      })),
    });
  } catch (error) {
    console.error("Error al obtener recaudación por fecha:", error);
    res.status(500).json({ error: "Error al obtener recaudación por fecha" });
  }
};

async function getTopProducts(req, res) {
  const { id_usuario } = req.query; // Cambié 'userId' a 'id_usuario'
  console.log("User Id en backend", id_usuario);

  try {
    if (!id_usuario) {  // Aquí también cambiamos 'userId' a 'id_usuario'
      return res.status(400).json({ error: 'id_usuario es obligatorio' });
    }

    // Obtenemos los productos más vendidos sumando las cantidades vendidas desde la tabla 'ventas'
    const topProducts = await Venta.findAll({
      attributes: [
        'nombre_producto',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidadVendida'],
      ],
      include: [
        {
          model: Caja,
          required: true,
          where: { id_usuario },
          attributes: []  // No necesitamos ninguna columna adicional de Caja
        }
      ],
      group: ['Venta.nombre_producto'],
      order: [[sequelize.literal('SUM(cantidad)'), 'DESC']],
      limit: 5
    });

    // Respondemos con los productos más vendidos
    return res.status(200).json(topProducts);

  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    return res.status(500).json({ error: "Hubo un error al obtener los productos más vendidos." });
  }
}


const getPaymentMethodUsage = async (req, res) => {
  try {
    const { id_usuario } = req.query; // Obtener el ID del usuario desde los parámetros de la consulta

    // Obtener las cajas del usuario
    const cajas = await Caja.findAll({
      where: { id_usuario }, // Filtrar por usuario
      attributes: ["id_caja"], // Solo necesitamos el ID de la caja
      raw: true,
    });

    if (cajas.length === 0) {
      return res.json({ message: "No hay cajas registradas para este usuario", data: [] });
    }

    // Obtener las ventas asociadas a las cajas del usuario
    const ventas = await Venta.findAll({
      where: {
        id_caja: cajas.map(caja => caja.id_caja), // Filtrar por las cajas del usuario
      },
      attributes: [
        "id_metodo_pago",
        [sequelize.fn("COUNT", sequelize.col("id_metodo_pago")), "cantidadUsada"],
      ],
      group: ["id_metodo_pago"],
      raw: true,
    });

    if (ventas.length === 0) {
      return res.json({ message: "No hay ventas registradas para las cajas de este usuario", data: [] });
    }

    // Obtener el total de ventas del usuario
    const totalVentas = ventas.reduce((acc, item) => acc + parseInt(item.cantidadUsada), 0);

    // Obtener los nombres de los métodos de pago
    const metodosPago = await MetodoPago.findAll({
      attributes: ["id_metodo_pago", "tipo_metodo_pago"],
      raw: true,
    });

    // Crear un objeto para mapear los IDs con sus nombres
    const metodoPagoMap = metodosPago.reduce((acc, metodo) => {
      acc[metodo.id_metodo_pago] = metodo.tipo_metodo_pago;
      return acc;
    }, {});

    // Calcular los porcentajes
    const resultado = ventas.map((item) => ({
      id_metodo_pago: item.id_metodo_pago,
      tipo_metodo_pago: metodoPagoMap[item.id_metodo_pago] || "Desconocido", // Corregido
      cantidad_usada: item.cantidadUsada,
      porcentaje: ((item.cantidadUsada / totalVentas) * 100).toFixed(2) + " %",
    }));

    res.json({ totalVentas, metodosPago: resultado });
  } catch (error) {
    console.error("Error al obtener el porcentaje de uso de los métodos de pago:", error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
};


module.exports = {
  addProductToSale,
  getSalesByCaja,
  updateSale,
  deleteSale,
  getStatistics,
  getRevenueByDate,
  getTopProducts,
  getPaymentMethodUsage,
};