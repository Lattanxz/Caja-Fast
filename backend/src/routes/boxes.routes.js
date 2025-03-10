const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  getProductsFromBox,
  updateBox,
  getBoxesByUserId,
  deleteBoxFromId,
  addProductToBox,
  deleteProductFromBox,
  createBox,
  getBoxById,
  getBoxDetails,
} = require("../controllers/boxes.controller");

/**
 * @swagger
 * /api/boxes/{id}:
 *   put:
 *     summary: Actualizar una caja
 *     description: Este endpoint actualiza los datos de una caja existente.
 *     tags:
 *       - Cajas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la caja a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre_Caja:
 *                 type: string
 *               Descripcion_Caja:
 *                 type: string
 *               Fecha_Apertura:
 *                 type: string
 *                 format: date-time
 *               Fecha_Cierre:
 *                 type: string
 *                 format: date-time
 *               Estado:
 *                 type: boolean
 *             required:
 *               - Nombre_Caja
 *               - Descripcion_Caja
 *               - Fecha_Apertura
 *               - Fecha_Cierre
 *               - Estado
 *     responses:
 *       200:
 *         description: Caja actualizada correctamente
 *       400:
 *         description: Solicitud incorrecta, faltan datos
 *       404:
 *         description: Caja no encontrada
 *       500:
 *         description: Error interno del servidor
 */

router.put("/:id", updateBox);  

/**
 * @swagger
 * /api/boxes/{id}:
 *   delete:
 *     summary: Eliminar una caja
 *     description: Este endpoint elimina una caja del sistema.
 *     tags:
 *          - Cajas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la caja
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Caja eliminada correctamente
 *       404:
 *         description: Caja no encontrada
 *       500:
 *         description: Error interno del servidor
 */

// DELETE
router.delete("/:id", deleteBoxFromId);

/**
 * @swagger
 * /api/boxes/{id_caja}/products:
 *   get:
 *     summary: Obtener productos de una caja
 *     description: Obtiene todos los productos asociados a una caja específica, mostrando nombre, precio y cantidad.
 *     tags:
 *       - Cajas
 *     parameters:
 *       - in: path
 *         name: id_caja
 *         required: true
 *         description: ID de la caja de la cual se desean obtener los productos.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Productos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_producto:
 *                     type: integer
 *                     example: 1
 *                   nombre_producto:
 *                     type: string
 *                     example: "Producto 1"
 *                   precio_producto:
 *                     type: number
 *                     format: float
 *                     example: 150.00
 *                   cantidad:
 *                     type: integer
 *                     example: 3
 *       404:
 *         description: La caja no tiene productos o no existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontraron productos para esta caja."
 *       500:
 *         description: Error al obtener los productos de la caja.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los productos de la caja"
 */

router.get("/:id_caja/products", getProductsFromBox);

/**
 * @swagger
 * /api/boxes/users/{id_usuario}:
 *   get:
 *     summary: Obtener todas las cajas de un usuario
 *     description: Devuelve una lista de todas las cajas asociadas a un id_usuario.
 *     tags: [Cajas]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: El ID del usuario para obtener sus cajas.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cajas encontradas y devueltas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_caja:
 *                     type: integer
 *                     description: ID del usuario.
 *                   nombre_usuario:
 *                     type: string
 *                     description: Nombre de la caja.
 *                   fecha_apertura:
 *                     type: string
 *                     format: date
 *                     description: Fecha de creación de la caja.
 *       404:
 *         description: No se encontraron cajas para este usuario.
 *       500:
 *         description: Error al obtener las cajas.
 */

router.get("/users/:id_usuario", getBoxesByUserId);

/**
 * @swagger
 * /api/boxes/{id_caja}/products:
 *   post:
 *     summary: Agregar un producto a la caja
 *     description: Agrega un producto a la caja seleccionada, actualizando la cantidad si ya existe.
 *     tags: [Cajas]
 *     parameters:
 *       - in: path
 *         name: id_caja
 *         required: true
 *         description: El ID de la caja a la que se va a agregar el producto.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_producto:
 *                 type: integer
 *                 description: El ID del producto que se va a agregar a la caja.
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 description: La cantidad de producto que se agregará a la caja.
 *                 example: 5
 *     responses:
 *       200:
 *         description: El producto se ha agregado correctamente a la caja o se ha actualizado la cantidad si ya existía.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto agregado a la caja correctamente.
 *       404:
 *         description: Caja o producto no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Caja no encontrada.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hubo un error al agregar el producto a la caja.
 */
router.post("/:id_caja/products", addProductToBox);

/**
 * @swagger
 * /api/boxes/{id_caja}/products/{id_producto}:
 *   delete:
 *     summary: Eliminar un producto de la caja
 *     description: Elimina un producto de la caja seleccionada, parcialmente basado en la cantidad proporcionada.
 *     tags: [Cajas]
 *     parameters:
 *       - in: path
 *         name: id_caja
 *         required: true
 *         description: El ID de la caja de la que se va a eliminar el producto.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id_producto
 *         required: true
 *         description: El ID del producto que se va a eliminar de la caja.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cantidad
 *         required: false
 *         description: La cantidad de producto que se desea eliminar (por defecto 1).
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente de la caja.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado de la caja correctamente.
 *       404:
 *         description: Caja o producto no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Caja o producto no encontrados.
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hubo un error al eliminar el producto de la caja.
 */
router.delete("/:id_caja/products/:id_producto", deleteProductFromBox);

/**
 * @swagger
 * /api/boxes/create:
 *   post:
 *     summary: Crea una nueva caja
 *     description: Crea una nueva caja asociada al usuario autenticado
 *     operationId: createBox
 *     tags:
 *       - Cajas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_caja:
 *                 type: string
 *               fecha_creacion:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: boolean
 *                 description: Estado de la caja (abierta/cerrada)
 *                 default: true  # Valor predeterminado
 *             required:
 *               - nombre_caja
 *               - fecha_creacion
 *     responses:
 *       201:
 *         description: Caja creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caja creada exitosamente"
 *                 caja:
 *                   $ref: '#/components/schemas/Caja'
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create", authenticateToken, createBox);

router.get("/:id_caja", getBoxById);

router.get("/getBoxDetails/:id_caja", getBoxDetails);

module.exports = router;
