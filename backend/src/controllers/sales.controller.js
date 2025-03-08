const pool = require("../config/db");
const Venta = require("../models/venta");
const Producto = require("../models/productosGeneral");
const { MetodoPago } = require("../models/MetodoPago");
const { Op } = require("sequelize");

// Añadir producto vendido
const addProductToSale = async (req, res) => {
  const { id_producto, cantidad, id_metodo_pago, id_caja, nombre_caja } = req.body;

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
    const pageSize = 10;
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

module.exports = {
  addProductToSale,
  getSalesByCaja,
  updateSale,
  deleteSale,
};