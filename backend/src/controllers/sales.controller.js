const pool = require("../config/db");

// Añadir producto vendido
const addProductToSale = async (req, res) => {
  const { id_producto, cantidad, id_metodo_pago } = req.body;

  try {
    const queryInsertVenta = `
      INSERT INTO ventas (total, nombre_producto)
      VALUES (0, '')
      RETURNING id_venta;
    `;
    const venta = await pool.query(queryInsertVenta);
    const id_venta = venta.rows[0].id_venta;

    if (!id_venta) {
      return res.status(500).json({ mensaje: "Error al crear la venta." });
    }

    const queryProducto = `
      SELECT precio_producto, nombre_producto
      FROM productos 
      WHERE id_producto = $1;
    `;
    const producto = await pool.query(queryProducto, [id_producto]);

    if (producto.rowCount === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    const precio_producto = producto.rows[0].precio_producto;
    const nombre_producto = producto.rows[0].nombre_producto;

    const acum_cantidad_prod = Number(cantidad);

    const subtotal = precio_producto * acum_cantidad_prod;

    console.log("id_venta:", id_venta);
    console.log("id_producto:", id_producto);
    console.log("acum_cantidad_prod:", acum_cantidad_prod);
    console.log("precio_producto:", precio_producto);
    console.log("id_metodo_pago:", id_metodo_pago);

    const queryInsertDetalleVenta = `
      INSERT INTO detalle_ventas (id_venta, id_producto, acum_cantidad_prod, precio_unitario, id_metodo_pago)
      VALUES ($1, $2, $3, $4, $5);
    `;
    await pool.query(queryInsertDetalleVenta, [
      id_venta,
      Number(id_producto),
      acum_cantidad_prod,
      precio_producto,
      id_metodo_pago,
    ]);

    const queryUpdateVenta = `
      UPDATE ventas
      SET total = total + $1,
          nombre_producto = CONCAT(nombre_producto, ', ', $2::TEXT)
      WHERE id_venta = $3
      RETURNING total;
    `;
    console.log("subtotal:", subtotal);
    console.log("nombre_producto:", nombre_producto);
    console.log("id_venta:", id_venta);

    const updatedVenta = await pool.query(queryUpdateVenta, [
      subtotal,
      nombre_producto,
      id_venta,
    ]);

    if (updatedVenta.rowCount === 0) {
      return res
        .status(500)
        .json({ mensaje: "Error al actualizar el total de la venta." });
    }

    const totalVenta = updatedVenta.rows[0].total;

    return res.status(200).json({
      mensaje: "Producto agregado correctamente a la venta.",
      total_venta: totalVenta,
      nombre_producto: nombre_producto,
    });
  } catch (err) {
    console.error("Error al agregar el producto a la venta:", err);
    return res.status(500).json({
      mensaje: "Error al agregar el producto a la venta.",
      error: err.message,
    });
  }
};

// Actualizar estadisticas
const updateStatistics = async () => {
  try {
    const queryTotalVentas = `
      SELECT SUM(total) AS total_ventas FROM ventas;
    `;
    const resultVentas = await pool.query(queryTotalVentas);
    const totalVentas = resultVentas.rows[0].total_ventas || 0;

    const queryTotalProductos = `
      SELECT SUM(acum_cantidad_prod) AS total_productos_vendidos 
      FROM detalle_ventas;
    `;
    const resultProductos = await pool.query(queryTotalProductos);
    const totalProductosVendidos =
      resultProductos.rows[0].total_productos_vendidos || 0;

    const queryMetodosPago = `
      SELECT id_metodo_pago, COUNT(*) AS cantidad_ventas
      FROM detalle_ventas
      GROUP BY id_metodo_pago;
    `;
    const resultMetodosPago = await pool.query(queryMetodosPago);

    // Calcular los porcentajes y armar el JSON
    const totalVentasCountQuery = `
      SELECT COUNT(*) AS total_ventas_count 
      FROM ventas;
    `;
    const totalVentasCountResult = await pool.query(totalVentasCountQuery);
    const totalVentasCount =
      totalVentasCountResult.rows[0].total_ventas_count || 1;

    let porcMetodosUsados = {};
    resultMetodosPago.rows.forEach((row) => {
      const porcentaje = (row.cantidad_ventas / totalVentasCount) * 100;
      porcMetodosUsados[row.id_metodo_pago] = {
        uso: row.cantidad_ventas,
        porcentaje: parseFloat(porcentaje.toFixed(2)),
      };
    });

    // Actualizar la tabla `estadisticas`
    const queryUpdateEstadisticas = `
      INSERT INTO estadisticas (id_estadistica, total_ventas, total_productos_vendidos, porc_metodos_usados)
      VALUES (1, $1, $2, $3)
      ON CONFLICT (id_estadistica) 
      DO UPDATE SET 
        total_ventas = EXCLUDED.total_ventas, 
        total_productos_vendidos = EXCLUDED.total_productos_vendidos,
        porc_metodos_usados = EXCLUDED.porc_metodos_usados;
    `;
    await pool.query(queryUpdateEstadisticas, [
      totalVentas,
      totalProductosVendidos,
      JSON.stringify(porcMetodosUsados),
    ]);
  } catch (err) {
    console.error("Error al actualizar las estadísticas:", err);
  }
};

module.exports = {
  addProductToSale,
  updateStatistics,
};
