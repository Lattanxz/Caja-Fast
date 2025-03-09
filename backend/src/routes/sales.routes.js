const express = require("express");
const { addProductToSale, getSalesByCaja, updateSale, deleteSale, getStatistics, getRevenueByDate, getTopProducts,  } = require("../controllers/sales.controller");
const router = express.Router();
/**
 * @swagger
 * /api/sales/addProduct:
 *   post:
 *     summary: Agregar un producto a una venta.
 *     description: Cuando se agrega un producto a la caja, se actualiza el total de la venta y se agrega al detalle de la venta.
 *     tags:
 *       - Ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_producto
 *               - cantidad
 *               - id_metodo_pago
 *             properties:
 *               id_producto:
 *                 type: integer
 *                 description: ID del producto a agregar.
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad de productos vendidos.
 *               id_metodo_pago:
 *                 type: integer
 *                 description: ID del método de pago utilizado.
 *     responses:
 *       200:
 *         description: Producto agregado correctamente a la venta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 total_venta:
 *                   type: number
 *                 nombre_producto:
 *                   type: string
 *       404:
 *         description: Producto no encontrado o venta no activa.
 *       500:
 *         description: Error al agregar el producto a la venta.
 */

router.post("/addProduct", addProductToSale);

router.get("/statistics", getStatistics);

router.get("/statisticsByDate", getRevenueByDate);

router.get("/statisticsByProducts",  getTopProducts);


router.get("/:id_caja", getSalesByCaja);

router.put("/update/:id_venta", updateSale); // Endpoint para actualizar

router.delete("/delete/:id_venta", deleteSale); // Endpoint para eliminar


module.exports = router;
