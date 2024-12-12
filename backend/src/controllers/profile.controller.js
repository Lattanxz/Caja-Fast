const pool = require("../config/db");

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

  // Verifica que el cuerpo de la solicitud contenga los campos necesarios
  if (!nombre_usuario || !email_usuario) {
    return res
      .status(400)
      .json({ message: "Nombre de usuario y email son requeridos" });
  }

  const userId = req.user.id_usuario; // Obtén el ID del usuario desde el token decodificado

  try {
    // Verifica si el usuario existe en la base de datos
    const userCheckQuery = "SELECT * FROM usuarios WHERE id_usuario = $1";
    const userCheckResult = await pool.query(userCheckQuery, [userId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza el nombre y el email del usuario en la base de datos
    const updateQuery = `
        UPDATE usuarios
        SET nombre_usuario = $1, email_usuario = $2
        WHERE id_usuario = $3
        RETURNING id_usuario, nombre_usuario, email_usuario, rol_usuario;
      `;

    const result = await pool.query(updateQuery, [
      nombre_usuario,
      email_usuario,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Error al actualizar el perfil" });
    }

    const updatedUser = result.rows[0];

    res.json({
      message: "Perfil actualizado con éxito",
      user: {
        id_usuario: updatedUser.id_usuario,
        nombre_usuario: updatedUser.nombre_usuario,
        email_usuario: updatedUser.email_usuario,
        rol_usuario: updatedUser.rol_usuario,
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
