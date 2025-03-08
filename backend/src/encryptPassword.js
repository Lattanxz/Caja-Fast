const bcrypt = require("bcryptjs");
const Usuario = require("./models/usuario"); // Importa el modelo correctamente
const { sequelize } = require("./config/db"); // Importa Sequelize desde db.js

const encriptarPassword = async (email, newPassword) => {
  try {
    await sequelize.authenticate(); // Asegura la conexión antes de hacer consultas

    const user = await Usuario.findOne({ where: { email_usuario: email } });

    if (!user) {
      console.log("Usuario no encontrado");
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Usuario.update(
      { password: hashedPassword },
      { where: { email_usuario: email } }
    );

    console.log("Contraseña actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la contraseña en la base de datos:", error);
  } finally {
    await sequelize.close(); // Cierra la conexión con la BD
  }
};

// Llama a la función con un email y una nueva contraseña
encriptarPassword("vellattanzio@gmail.com", "NuevaContraseñaSegura");
