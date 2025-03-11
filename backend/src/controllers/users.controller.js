const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {Usuario} = require("../models/usuario");
const Lista = require("../models/lista");
const ProductoLista = require("../models/productoLista");
const Cajas = require("../models/cajas");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");


// Crear USUARIO
const createUser = async (req, res) => {
  const { nombre_usuario, email_usuario, password, id_rol, id_estado } = req.body;

  // Validación básica
  if (!nombre_usuario || !email_usuario || !password || !id_rol) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }

  // Si no se pasa un `id_estado`, se usa el valor por defecto (Activo)
  const estado = id_estado || 1;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario utilizando Sequelize con el id_estado dinámico
    const newUser = await Usuario.create({
      nombre_usuario,
      email_usuario,
      password: hashedPassword,
      id_rol,
      id_estado: estado, // Usamos el valor pasado en la solicitud o 1 por defecto
    });

    // Responder con los datos del nuevo usuario
    res.status(201).json({
      usuario: {
        id_usuario: newUser.id_usuario,
        nombre_usuario: newUser.nombre_usuario,
        email_usuario: newUser.email_usuario,
        id_rol: newUser.id_rol,
        id_estado: newUser.id_estado,
      },
    });
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    // Utiliza Sequelize para obtener todos los usuarios
    const users = await Usuario.findAll();

    res.status(200).json(users);
  } catch (err) {
    console.error("Error al obtener los usuarios:", err);
    res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
};

// Datos de usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params; // Cambié 'id_usuario' por 'id'

  try {
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};


// Actualizar user por id
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, email_usuario, password, id_rol, id_estado } = req.body;

  try {
    let hashedPassword = null;

    // Encriptar la contraseña solo si se proporciona una nueva
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Buscar el usuario por ID
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizar los campos del usuario
    await user.update({
      nombre_usuario,
      email_usuario,
      password: hashedPassword || user.password, 
      id_rol,
      id_estado,
    });

    res.status(200).json({ mensaje: "Usuario actualizado correctamente", usuario: user });
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
};

// Borrar usuario por ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction(); // Usamos una transacción de Sequelize

  try {
    // Verificar si existen cajas asociadas al id_usuario y eliminarlas
    await Cajas.destroy({
      where: { id_usuario: id },
      transaction: t,
    });

    // Obtener las listas asociadas al id_usuario
    const listas = await Lista.findAll({
      where: { id_usuario: id },
      attributes: ["id_lista"],
      transaction: t,
    });

    const idListas = listas.map((lista) => lista.id_lista);

    // Eliminar las relaciones en productos_listas si existen
    if (idListas.length > 0) {
      await ProductoLista.destroy({
        where: {
          id_lista: {
            [Op.in]: idListas, // Usamos los id_lista obtenidos previamente
          },
        },
        transaction: t,
      });

      // Eliminar las listas asociadas al id_usuario
      await Lista.destroy({
        where: { id_usuario: id },
        transaction: t,
      });
    }

    // Eliminar el usuario
    const usuarioEliminado = await Usuario.destroy({
      where: { id_usuario: id },
      transaction: t,
    });

    if (usuarioEliminado === 0) {
      await t.rollback();
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await t.commit(); // Confirmar la transacción
    res.status(200).json({
      mensaje: "Usuario y sus datos asociados eliminados correctamente",
    });
  } catch (error) {
    await t.rollback(); // Revertir si hay error
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar el usuario y sus datos" });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
