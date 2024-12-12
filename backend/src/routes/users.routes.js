const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Este endpoint crea un nuevo usuario en el sistema.
 *     tags:
 *          - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               email_usuario:
 *                 type: string
 *               password:
 *                 type: string
 *               rol_usuario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", async (req, res) => {
  const { nombre_usuario, email_usuario, password, rol_usuario } = req.body;

  // Validación básica
  if (!nombre_usuario || !email_usuario || !password || !rol_usuario) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Query para insertar el usuario en la base de datos
    const query = `
      INSERT INTO usuarios (nombre_usuario, email_usuario, password, rol_usuario)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      nombre_usuario,
      email_usuario,
      hashedPassword,
      rol_usuario,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios.
 *     tags:
 *          - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", async (req, res) => {
  const query = "SELECT * FROM Usuarios;";

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario específico
 *     description: Devuelve un usuario por su ID.
 *     tags:
 *          - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM Usuarios WHERE ID_Usuario = $1;";
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario existente.
 *     tags:
 *          - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               email_usuario:
 *                 type: string
 *               password:
 *                 type: string
 *               rol_usuario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, email_usuario, password, rol_usuario } = req.body;

  try {
    let hashedPassword = null;

    // Encriptar la contraseña solo si se proporciona una nueva
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const query = `
      UPDATE usuarios
      SET nombre_usuario = $1, email_usuario = $2, 
          password = COALESCE($3, password), 
          rol_usuario = $4
      WHERE id_usuario = $5
      RETURNING *;
    `;

    const result = await pool.query(query, [
      nombre_usuario,
      email_usuario,
      hashedPassword,
      rol_usuario,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID y todas las entidades asociadas a él.
 *     tags:
 *          - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect(); // Usamos client para manejar transacciones

  try {
    await client.query("BEGIN"); // Iniciar transacción

    // Eliminar las relaciones en productos_listas asociadas a este usuario
    const deleteProductosListasQuery = `
      DELETE FROM productos_listas
      WHERE id_lista IN (
        SELECT id_lista FROM listas WHERE id_usuario = $1
      );
    `;
    await client.query(deleteProductosListasQuery, [id]);

    // Eliminar las listas asociadas al usuario
    const deleteListasQuery = `
      DELETE FROM listas
      WHERE id_usuario = $1;
    `;
    await client.query(deleteListasQuery, [id]);

    // Eliminar las cajas asociadas al usuario
    const deleteCajasQuery = `
      DELETE FROM cajas
      WHERE id_usuario = $1;
    `;
    await client.query(deleteCajasQuery, [id]);

    // Eliminar el usuario
    const deleteUsuarioQuery = `
      DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *;
    `;
    const result = await client.query(deleteUsuarioQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await client.query("COMMIT"); // Confirmar transacción
    res.status(200).json({
      mensaje: "Usuario y sus datos asociados eliminados correctamente",
    });
  } catch (err) {
    await client.query("ROLLBACK"); // Revertir si hay error
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el usuario y sus datos" });
  } finally {
    client.release(); // Liberar el cliente de la conexión
  }
});

module.exports = router;
