const pool = require("../config/db");
const {Usuario} = require("../models/usuario"); // Asegúrate de importar el modelo correcto


// Obtener el perfil de un usuario
const getProfile = async (req, res) => {
  try {
    const { id } = req.user; // `id` se obtiene del middleware de autenticación
    const query =
      "SELECT nombre_usuario, email_usuario FROM usuarios WHERE id_usuario = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar el perfil de un usuario
const updateProfile = async (req, res) => {
  const { nombre_usuario, email_usuario } = req.body;

  // Verifica que los datos sean válidos
  if (!nombre_usuario || !email_usuario) {
    return res.status(400).json({
      message: "Nombre de usuario y email son requeridos",
    });
  }

  const userId = req.user.id_usuario; // Obtiene el ID del usuario autenticado desde el token

  try {
    // Busca el usuario por ID en la base de datos
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el usuario
    await usuario.update({
      nombre_usuario,
      email_usuario,
    });

    res.status(200).json({
      message: "Perfil actualizado con éxito",
      user: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        email_usuario: usuario.email_usuario,
        rol_usuario: usuario.rol_usuario, // Si en la base de datos existe este campo
      },
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
