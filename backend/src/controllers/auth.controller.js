const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {Usuario} = require("../models/usuario")
const transporter = require("../config/mailer");

// Función para generar un código de verificación de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};


const login = async (req, res) => {
  console.log("Request body recibido:", req.body);

  const { email_usuario, password } = req.body;

  if (!email_usuario || !password) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    // Buscar al usuario por email usando Sequelize
    const user = await Usuario.findOne({ where: { email_usuario } });
    console.log("Usuario encontrado:", user);

    if (!user) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    // Comparar la contraseña enviada con la almacenada usando bcrypt
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña en BD:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    // Crear un payload para el token
    const payload = {
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      email_usuario: user.email_usuario,
      id_rol: user.id_rol,
      id_estado: user.id_estado,
    };
    console.log("Payload del token:", payload);

    // Generar el token
    const token = jwt.sign(payload, "tu_secreto", { expiresIn: "1h" });

    // Enviar el rol y el token en la respuesta, además del redireccionamiento
    return res.json({
      mensaje: "Autenticación exitosa",
      token,
      id_usuario: user.id_usuario,
      id_rol: user.id_rol, // Enviamos el rol al frontend
      redirect: user.id_rol === 2 ? "/users" : "/boxes", // Redirección según el rol
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const checkAuthStatus = (req, res) => {
  // Verificar el token en los encabezados
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  // Verificar el token
  jwt.verify(token, "tu_secreto", (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }
    console.log("Token decodificado:", decoded);
    // Si el token es válido, responder con el estado de autenticación
    return res.json({
      isLoggedIn: true,
      role: decoded.id_rol, // Usamos el nuevo nombre del rol
      id_usuario: decoded.id_usuario,
    });
  });
};


// Controlador de registro
const registerUser = async (req, res) => {
  console.log("Request body recibido:", req.body);

  const { nombre_usuario, email_usuario, password } = req.body;

  if (!nombre_usuario || !email_usuario || !password) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }
 
  try {
    // Verificar si el usuario o el email ya existen
    const existingUser = await Usuario.findOne({
      where: {
        [Op.or]: [{ nombre_usuario }, { email_usuario }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ mensaje: "El usuario o el email ya están registrados" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario en la base de datos con rol por defecto y estado activo
    const newUser = await Usuario.create({
      nombre_usuario,
      email_usuario,
      password: hashedPassword,
      id_rol: 1, // Rol predeterminado: Usuario
      id_estado: 1, // Estado predeterminado: Activo
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      user: {
        id_usuario: newUser.id_usuario,
        nombre_usuario: newUser.nombre_usuario,
        email_usuario: newUser.email_usuario,
        id_rol: newUser.id_rol,
        id_estado: newUser.id_estado,
      },
    });
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};



const logoutSession = async (req, res) => {
  try {
    // Limpia la cookie del token si estás usando cookies para manejar la sesión
    res.clearCookie("token", { httpOnly: true, secure: true });

    // Envía una respuesta exitosa
    res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    res.status(500).json({ mensaje: "Error al cerrar la sesión" });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email_usuario } = req.body;

  if (!email_usuario) {
    return res.status(400).json({ mensaje: "El email es requerido" });
  }

  try {
    // Verificar si el usuario existe
    const user = await Usuario.findOne({ where: { email_usuario } });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Generar código de verificación de 6 dígitos
    const verificationCode = generateVerificationCode();

    // Guardar el código en la base de datos
    await user.update({ verification_code: verificationCode });

    // Enviar el código por correo electrónico
    await transporter.sendMail({
      from: '"Soporte CajaFast" <tuemail@example.com>',
      to: user.email_usuario,
      subject: "Código de recuperación de contraseña",
      html: `
        <p>Hola ${user.nombre_usuario},</p>
        <p>Tu código de recuperación de contraseña es: <strong>${verificationCode}</strong></p>
        <p>Este código es válido por un tiempo limitado.</p>
      `,
    });

    res.json({ mensaje: "Correo con el código de verificación enviado" });

  } catch (err) {
    console.error("Error al enviar el código:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const resetPassword = async (req, res) => {
  const { email_usuario, nueva_contrasena } = req.body;

  if (!nueva_contrasena || !email_usuario) {
    return res.status(400).json({ mensaje: "El email y la nueva contraseña son requeridos" });
  }

  try {
    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email_usuario } });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar si el código de verificación existe y coincide
    if (!usuario.verification_code) {
      return res.status(400).json({ mensaje: "El código de verificación no está disponible o ya fue usado" });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);

    // Actualizar la contraseña y eliminar el código de verificación
    await usuario.update({
      password: hashedPassword,
      verification_code: null // Eliminar el código de verificación una vez usado
    });

    res.json({ mensaje: "Contraseña actualizada exitosamente" });
    
  } catch (err) {
    console.error("Error al cambiar la contraseña:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email_usuario, verification_code } = req.body;

    // Validar que ambos valores estén presentes
    if (!email_usuario || !verification_code) {
      return res.status(400).json({ mensaje: "El email y el código son requeridos" });
    }

    const usuario = await Usuario.findOne({ where: { email_usuario } });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.verification_code || usuario.verification_code !== verification_code) {
      return res.status(400).json({ mensaje: "Código de verificación inválido" });
    }

    usuario.verification_code = null;
    await usuario.save();

    return res.json({ mensaje: "Código verificado correctamente", id_usuario: usuario.id_usuario });
  } catch (error) {
    console.error("Error al verificar el código:", error);
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

const updatePassword = async (req, res) => {
  const { id_usuario, nueva_contrasena } = req.body;

  if (!id_usuario || !nueva_contrasena) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    // Buscar el usuario por ID-
    const usuario = await Usuario.findOne({ where: { id_usuario } });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Generar el salt y el hash para la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);

    // Actualizar la contraseña
    usuario.password = hashedPassword;

    // Guardar el usuario con la nueva contraseña
    await usuario.save();

    return res.status(200).json({
      mensaje: "Contraseña actualizada exitosamente",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensaje: "Error al actualizar la contraseña" });
  }
};

module.exports = {
  registerUser,
  login,
  updatePassword,
  logoutSession,
  checkAuthStatus,
  requestPasswordReset,
  resetPassword,
  verifyCode,
};
