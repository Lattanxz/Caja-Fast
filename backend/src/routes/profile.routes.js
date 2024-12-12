const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener el perfil de un usuario autenticado
 *     description: Devuelve el nombre y el correo del usuario autenticado.
 *     tags:
 *       - Profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre_usuario:
 *                   type: string
 *                   description: El nombre del usuario.
 *                 email_usuario:
 *                   type: string
 *                   description: El correo electrónico del usuario.
 *       401:
 *         description: No se proporcionó un token de autenticación
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authenticateToken, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Actualizar el perfil de un usuario autenticado
 *     description: Permite al usuario autenticado actualizar su nombre y correo.
 *     tags:
 *       - Profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: El nuevo nombre del usuario.
 *               email_usuario:
 *                 type: string
 *                 description: El nuevo correo electrónico del usuario.
 *             required:
 *               - nombre_usuario
 *               - email_usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       description: El ID del usuario.
 *                     nombre_usuario:
 *                       type: string
 *                       description: El nombre actualizado del usuario.
 *                     email_usuario:
 *                       type: string
 *                       description: El correo electrónico actualizado del usuario.
 *       400:
 *         description: Datos no válidos
 *       401:
 *         description: No se proporcionó un token de autenticación
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/", authenticateToken, updateProfile);

module.exports = router;
