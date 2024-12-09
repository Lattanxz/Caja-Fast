const express = require("express");
const {
  getAllPaymentMethods,
} = require("../controllers/paymentMethod.controller");

const router = express.Router();

/**
 * @swagger
 * /api/paymentMethod:
 *   get:
 *     summary: Obtener todos los métodos de pago
 *     description: Devuelve una lista de los métodos de pago disponibles en el sistema.
 *     tags:
 *          - Pagos
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_Metodo_Pago:
 *                     type: integer
 *                     example: 1
 *                   Tipo_Metodo_Pago:
 *                     type: string
 *                     example: "Efectivo"
 *                   Descripcion:
 *                     type: string
 *                     example: "Pago en efectivo"
 *       500:
 *         description: Error al obtener los métodos de pago
 */
router.get("/", getAllPaymentMethods);

module.exports = router;
