const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToBox,
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

/**
 * @swagger
 * /api/products/box:
 *   post:
 *     summary: Agrega un producto a una caja
 *     description: Permite agregar un producto a una caja especificando el ID del producto, el ID de la caja y la cantidad.
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_producto
 *               - id_caja
 *               - cantidad
 *             properties:
 *               id_producto:
 *                 type: integer
 *                 description: ID del producto que se desea agregar.
 *                 example: 1
 *               id_caja:
 *                 type: integer
 *                 description: ID de la caja donde se agregará el producto.
 *                 example: 2
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del producto a agregar.
 *                 example: 5
 *     responses:
 *       201:
 *         description: Producto agregado a la caja con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto agregado a la caja con éxito
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                       example: 1
 *                     id_caja:
 *                       type: integer
 *                       example: 2
 *                     cantidad:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Datos faltantes o inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error al agregar el producto a la caja
 */
router.post("/box", addProductToBox);

module.exports = router;
