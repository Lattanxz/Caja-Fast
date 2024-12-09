const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Retorna una lista de todos los productos disponibles.
 *     tags:
 *          - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Retorna un producto específico según su ID.
 *     tags:
 *          - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Agrega un nuevo producto a la base de datos.
 *     tags:
 *          - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre_Producto:
 *                 type: string
 *               Precio_Producto:
 *                 type: number
 *               Descripcion_Producto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post("/", createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: Actualiza los detalles de un producto específico.
 *     tags:
 *          - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre_Producto:
 *                 type: string
 *               Precio_Producto:
 *                 type: number
 *               Descripcion_Producto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto específico de la base de datos.
 *     tags:
 *          - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", deleteProduct);

module.exports = router;
