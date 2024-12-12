const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const Joi = require("joi");
const {
  getProductsFromBox,
  updateBox,
  getBoxesByUserId,
  createBoxWithProducts,
} = require("../controllers/boxes.controller");

const cajaSchema = Joi.object({
  ID_Usuario: Joi.number().integer().required(), // Validar que sea un número entero y requerido
  Nombre_Caja: Joi.string().min(3).max(255).required(), // Nombre debe ser una cadena entre 3 y 255 caracteres
  Descripcion_Caja: Joi.string().min(3).max(500).optional(), // Descripción opcional
  Fecha_Apertura: Joi.date().iso().required(), // Validar que sea una fecha en formato ISO
  Fecha_Cierre: Joi.date().iso().optional(), // Validar que sea una fecha en formato ISO
  estado: Joi.boolean().required(), // Validar que sea un booleano
});

/**
 * @swagger
 * /api/boxes:
 *   post:
 *     summary: Crear una nueva caja
 *     description: Este endpoint crea una nueva caja en el sistema.
 *     tags:
 *          - Cajas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_Usuario:
 *                 type: integer
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
 *               estado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Caja creada correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */

router.post("/", async (req, res) => {
  const { error } = cajaSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ mensaje: "Datos incorrectos", detalles: error.details });
  }

  const {
    ID_Usuario,
    Nombre_Caja,
    Descripcion_Caja,
    Fecha_Apertura,
    Fecha_Cierre,
    estado,
  } = req.body;

  const query = `
    INSERT INTO Cajas (ID_Usuario, Nombre_Caja, Descripcion_Caja, Fecha_Apertura, Fecha_Cierre, estado)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [
      ID_Usuario,
      Nombre_Caja,
      Descripcion_Caja,
      Fecha_Apertura,
      Fecha_Cierre,
      estado,
    ]);
    res.status(201).json(result.rows[0]); // Devuelve la caja creada
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear la caja" });
  }
});

/**
 * @swagger
 * /api/boxes:
 *   get:
 *     summary: Obtener todas las cajas
 *     description: Este endpoint obtiene todas las cajas del sistema.
 *     tags:
 *          - Cajas
 *     responses:
 *       200:
 *         description: Lista de cajas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_Caja:
 *                     type: integer
 *                   Nombre_Caja:
 *                     type: string
 *                   Descripcion_Caja:
 *                     type: string
 *                   Fecha_Apertura:
 *                     type: string
 *                     format: date-time
 *                   Fecha_Cierre:
 *                     type: string
 *                     format: date-time
 *                   estado:
 *                     type: boolean
 *       500:
 *         description: Error interno del servidor
 */

// GET
// 2. Obtener todas las cajas
router.get("/", async (req, res) => {
  const query = "SELECT * FROM Cajas;";

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows); // Devuelve todas las cajas
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener las cajas" });
  }
});

/**
 * @swagger
 * /api/boxes/{id}:
 *   get:
 *     summary: Obtener una caja específica
 *     description: Este endpoint obtiene una caja específica por su ID.
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
 *         description: Caja encontrada
 *       404:
 *         description: Caja no encontrada
 *       500:
 *         description: Error interno del servidor
 */

// GET
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM Cajas WHERE ID_Caja = $1;";

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }
    res.status(200).json(result.rows[0]); // Devuelve la caja encontrada
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener la caja" });
  }
});

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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const query = "DELETE FROM Cajas WHERE ID_Caja = $1 RETURNING *;";

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }
    res.status(200).json({ mensaje: "Caja eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar la caja" });
  }
});

/**
 * @swagger
 * /api/boxes/{id_caja}/products:
 *   get:
 *     summary: Obtiene todos los productos dentro de una caja específica con sus cantidades.
 *     tags: [Cajas]
 *     parameters:
 *       - in: path
 *         name: id_caja
 *         required: true
 *         description: ID de la caja para obtener los productos.
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
 *       404:
 *         description: No se encontraron productos para esta caja.
 *       500:
 *         description: Error al obtener los productos de la caja.
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
 * /api/boxes/createBoxWithProducts:
 *   post:
 *     summary: Crear una nueva caja con productos
 *     description: Crea una caja con los productos seleccionados.
 *     tags:
 *       - Cajas
 *     requestBody:
 *       description: Los productos que se agregarán a la caja.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCaja:
 *                 type: string
 *                 description: El nombre de la caja.
 *               productos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: El nombre de cada producto.
 *             required:
 *               - nombreCaja
 *               - productos
 *     responses:
 *       200:
 *         description: Caja creada con éxito con los productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idCaja:
 *                   type: string
 *                   description: El ID de la nueva caja creada.
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de productos añadidos a la caja.
 *       400:
 *         description: Error de validación o datos incompletos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/createBoxWithProducts", createBoxWithProducts);

module.exports = router;
