const express = require("express");
const router = express.Router();
const {
  login,
  registerUser,
  updatePassword,
  logoutSession,
  checkAuthStatus,
  requestPasswordReset,
  resetPassword,
  verifyCode,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticación de usuario
 *     description: Permite a los usuarios autenticarse utilizando su email y contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_usuario:
 *                 type: string
 *                 example: "usuario@example.com"
 *                 description: El email del usuario (obligatorio).
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *                 description: Contraseña del usuario (obligatorio).
 *             required:
 *               - email_usuario
 *               - password
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Autenticación exitosa"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Solicitud incorrecta, faltan campos requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Faltan campos requeridos"
 *       401:
 *         description: Email o contraseña incorrectos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Email o contraseña incorrectos"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
 */

router.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de usuario
 *     description: Permite a los usuarios registrarse con nombre de usuario, email y contraseña. El rol se asigna automáticamente como "usuario".
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: "usuario123"
 *                 description: Nombre de usuario del nuevo usuario.
 *               email_usuario:
 *                 type: string
 *                 example: "usuario@example.com"
 *                 description: Email del nuevo usuario.
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *                 description: Contraseña del nuevo usuario.
 *             required:
 *               - nombre_usuario
 *               - email_usuario
 *               - password
 *     responses:
 *       201:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     nombre_usuario:
 *                       type: string
 *                       example: "usuario123"
 *                     email_usuario:
 *                       type: string
 *                       example: "usuario@example.com"
 *                     rol_usuario:
 *                       type: string
 *                       example: "usuario"
 *       400:
 *         description: El usuario o el email ya están registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El usuario o el email ya están registrados"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Actualización de contraseña de usuario
 *     description: Permite a un usuario actualizar su contraseña utilizando su ID y la nueva contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *                 description: ID del usuario cuyo password será actualizado.
 *               nueva_contrasena:
 *                 type: string
 *                 example: "nuevaContraseña123"
 *                 description: Nueva contraseña del usuario.
 *             required:
 *               - id_usuario
 *               - nueva_contrasena
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Solicitud incorrecta, faltan campos requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Faltan campos requeridos"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al actualizar la contraseña"
 */
router.post("/update-password", updatePassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión del usuario
 *     description: Invalida la sesión del usuario al eliminar el token del lado del cliente. No requiere autenticación.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/logout", logoutSession);

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Verificar el estado de la autenticación
 *     description: Verifica si el usuario está autenticado y devuelve el rol.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: El estado de autenticación y el rol del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: string
 *                   example: "administrador"
 *       401:
 *         description: Usuario no autorizado, token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/status", checkAuthStatus);

 /**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Solicitud de restablecimiento de contraseña
 *     description: Permite a los usuarios solicitar un restablecimiento de contraseña proporcionando su email.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_usuario:
 *                 type: string
 *                 example: "usuario@example.com"
 *                 description: El email del usuario que solicita el restablecimiento de contraseña.
 *             required:
 *               - email_usuario
 *     responses:
 *       200:
 *         description: Solicitud de restablecimiento de contraseña exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Solicitud de restablecimiento de contraseña enviada"
 *       400:
 *         description: Solicitud incorrecta, falta el email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Falta el email"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
 */
router.post("/request-password-reset", requestPasswordReset);


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecimiento de contraseña
 *     description: Permite a los usuarios restablecer su contraseña utilizando un token de restablecimiento y la nueva contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: El token de restablecimiento de contraseña.
 *               nueva_contrasena:
 *                 type: string
 *                 example: "nuevaContraseña123"
 *                 description: La nueva contraseña del usuario.
 *             required:
 *               - token
 *               - nueva_contrasena
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Contraseña restablecida exitosamente"
 *       400:
 *         description: Solicitud incorrecta, faltan campos requeridos o token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Faltan campos requeridos o token inválido"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/verify-code:
 *   post:
 *     summary: Verificación de código
 *     description: Permite a los usuarios verificar un código de restablecimiento de contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_usuario:
 *                 type: string
 *                 example: "usuario@example.com"
 *                 description: El email del usuario que solicita la verificación del código.
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *                 description: El código de verificación enviado al email del usuario.
 *             required:
 *               - email_usuario
 *               - codigo
 *     responses:
 *       200:
 *         description: Código verificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Código verificado exitosamente"
 *       400:
 *         description: Solicitud incorrecta, faltan campos requeridos o código inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Faltan campos requeridos o código inválido"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error en el servidor"
 */
router.post("/verify-code", verifyCode);

module.exports = router;
