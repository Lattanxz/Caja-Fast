const express = require("express");
const {
  createList,
  addProductToList,
  getProductsFromList,
  removeProductFromList,
  removeList,
  getAllLists,
  generateList,
} = require("../controllers/lists.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Crea una nueva lista.
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_lista:
 *                 type: string
 *                 description: Nombre de la lista.
 *               estado_seguridad:
 *                 type: string
 *                 enum: [global, privada]
 *                 description: Define si la lista es global o privada.
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario propietario de la lista (obligatorio).
 *     responses:
 *       201:
 *         description: Lista creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_lista:
 *                   type: integer
 *       400:
 *         description: El campo id_usuario es obligatorio.
 *       500:
 *         description: Error al crear la lista.
 */
router.post("/", createList);

/**
 * @swagger
 * /api/lists/products:
 *   post:
 *     summary: Agrega un producto a una lista.
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_lista:
 *                 type: integer
 *                 description: ID de la lista a la que se va a agregar el producto.
 *               id_producto:
 *                 type: integer
 *                 description: ID del producto que se va a agregar a la lista.
 *     responses:
 *       201:
 *         description: Producto agregado a la lista exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_lista:
 *                   type: integer
 *                 id_producto:
 *                   type: integer
 *                 id_usuario:
 *                   type: integer
 *       400:
 *         description: Error, id_lista y id_producto son obligatorios.
 *       404:
 *         description: Lista no encontrada o Producto no encontrado.
 *       500:
 *         description: Error al agregar el producto a la lista.
 */
router.post("/products", addProductToList);

/**
 * @swagger
 * /api/lists/{id_lista}/products:
 *   get:
 *     summary: Obtiene los productos asociados a una lista específica.
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id_lista
 *         required: true
 *         description: ID de la lista para la que se obtendrán los productos.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Productos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Productos obtenidos exitosamente.
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_producto:
 *                         type: integer
 *                       nombre_producto:
 *                         type: string
 *                       precio_producto:
 *                         type: number
 *                         format: float
 *                       descripcion_producto:
 *                         type: string
 *       404:
 *         description: No se encontraron productos para esta lista.
 *       500:
 *         description: Error al obtener los productos de la lista.
 */

router.get("/:id_lista/products", getProductsFromList);

/**
 * @swagger
 * /api/lists/products:
 *   delete:
 *     summary: Elimina un producto de una lista.
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_lista:
 *                 type: integer
 *                 description: ID de la lista de la que se eliminará el producto.
 *               id_producto:
 *                 type: integer
 *                 description: ID del producto que se eliminará de la lista.
 *     responses:
 *       200:
 *         description: Producto eliminado de la lista exitosamente.
 *       400:
 *         description: id_lista o id_producto son obligatorios.
 *       404:
 *         description: Producto no encontrado en la lista.
 *       500:
 *         description: Error interno del servidor al eliminar el producto.
 */

router.delete("/products", removeProductFromList);

/**
 * @swagger
 * /api/lists/{id_lista}:
 *   delete:
 *     summary: Elimina una lista y sus productos asociados.
 *     tags: [Lists]
 *     parameters:
 *       - name: id_lista
 *         in: path
 *         required: true
 *         description: ID de la lista a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista y productos asociados eliminados exitosamente.
 *       404:
 *         description: Lista no encontrada.
 *       500:
 *         description: Error interno del servidor al eliminar la lista.
 */
router.delete("/:id_lista", removeList);

// Agarrar todas las listas y ponerlas en loadlist (NO TOCAR)
router.get("/", getAllLists);

// Generar una lista (NO TOCAR)
router.post("/", authenticateToken, generateList);

module.exports = router;
