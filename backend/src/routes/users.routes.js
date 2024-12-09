const express = require("express");
const pool = require("../config/db");
const router = express.Router();

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
 *               Nombre_Usuario:
 *                 type: string
 *               Email_Usuario:
 *                 type: string
 *               Contrasena_Usuario:
 *                 type: string
 *               Rol_Usuario:
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
  const { Nombre_Usuario, Email_Usuario, Contrasena_Usuario, Rol_Usuario } =
    req.body;

  const query = `
    INSERT INTO Usuarios (Nombre_Usuario, Email_Usuario, Contrasena_Usuario, Rol_Usuario)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      Nombre_Usuario,
      Email_Usuario,
      Contrasena_Usuario,
      Rol_Usuario,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear el usuario" });
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
 *               Nombre_Usuario:
 *                 type: string
 *               Email_Usuario:
 *                 type: string
 *               Contrasena_Usuario:
 *                 type: string
 *               Rol_Usuario:
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
  const { Nombre_Usuario, Email_Usuario, Contrasena_Usuario, Rol_Usuario } =
    req.body;

  const query = `
    UPDATE Usuarios
    SET Nombre_Usuario = $1, Email_Usuario = $2, Contrasena_Usuario = $3, Rol_Usuario = $4
    WHERE ID_Usuario = $5
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      Nombre_Usuario,
      Email_Usuario,
      Contrasena_Usuario,
      Rol_Usuario,
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID.
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

  const query = "DELETE FROM Usuarios WHERE ID_Usuario = $1 RETURNING *;";
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar el usuario" });
  }
});

module.exports = router;
