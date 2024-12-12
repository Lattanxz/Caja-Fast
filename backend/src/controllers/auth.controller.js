const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db"); // Ajusta según la ubicación de tu configuración de base de datos

// Controlador de login
const login = async (req, res) => {
  console.log("Request body recibido:", req.body);

  const { email_usuario, password } = req.body;

  if (!email_usuario || !password) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    // Buscar al usuario por email_usuario
    const userQuery = "SELECT * FROM usuarios WHERE email_usuario = $1";
    const userResult = await pool.query(userQuery, [email_usuario]);

    if (userResult.rows.length === 0) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    const user = userResult.rows[0];

    // Comparar la contraseña enviada con la almacenada
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
      rol_usuario: user.rol_usuario,
    };
    console.log("Payload del token:", payload);

    const token = jwt.sign(payload, "tu_secreto", { expiresIn: "1h" });

    // Enviar el rol y el token en la respuesta, además del redireccionamiento
    return res.json({
      mensaje: "Autenticación exitosa",
      token,
      id_usuario: user.id_usuario,
      role: user.rol_usuario, // Enviamos el rol al frontend
      redirect: user.rol_usuario === "administrador" ? "/users" : "/boxes",
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
      role: decoded.rol_usuario, // Asegúrate de que el payload contenga el rol
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
    const userResult = await pool.query(
      "SELECT * FROM usuarios WHERE nombre_usuario = $1 OR email_usuario = $2",
      [nombre_usuario, email_usuario]
    );

    if (userResult.rows.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "El usuario o el email ya están registrados" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos con rol "usuario"
    const newUser = await pool.query(
      "INSERT INTO usuarios (nombre_usuario, email_usuario, password, rol_usuario) VALUES ($1, $2, $3, 'usuario') RETURNING *",
      [nombre_usuario, email_usuario, hashedPassword]
    );

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Actualizar la contraseña de un usuario
const updatePassword = async (req, res) => {
  const { id_usuario, nueva_contrasena } = req.body;

  if (!id_usuario || !nueva_contrasena) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    // Generar el salt y el hash para la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);

    // Realizar la consulta para actualizar la contraseña
    const query = "UPDATE usuarios SET password = $1 WHERE id_usuario = $2";
    const values = [hashedPassword, id_usuario];

    await pool.query(query, values);

    return res.status(200).json({
      mensaje: "Contraseña actualizada exitosamente",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ mensaje: "Error al actualizar la contraseña" });
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

module.exports = {
  registerUser,
  login,
  updatePassword,
  logoutSession,
  checkAuthStatus,
};
