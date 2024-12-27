const bcrypt = require("bcryptjs");
const saltRounds = 10;
const Usuario = require("../models/Usuario");
const Lista = require("../models/Lista");
const ProductoLista = require("../models/ProductoLista");
const Cajas = require("../models/cajas");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");

// Crear USUARIO
const createUser = async (req, res) => {
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

    // Crear el usuario utilizando Sequelize
    const newUser = await Usuario.create({
      nombre_usuario,
      email_usuario,
      password: hashedPassword,
      rol_usuario,
    });

    // Responder con los datos del nuevo usuario
    res.status(201).json({
      usuario: {
        id_usuario: newUser.id_usuario,
        nombre_usuario: newUser.nombre_usuario,
        email_usuario: newUser.email_usuario,
        rol_usuario: newUser.rol_usuario,
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
  const { id_usuario } = req.params;

  try {
    const user = await Usuario.findByPk(id_usuario);

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
  const { nombre_usuario, email_usuario, password, rol_usuario } = req.body;

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
      password: hashedPassword || user.password, // Mantener la contraseña actual si no se proporciona una nueva
      rol_usuario,
    });

    res.status(200).json(user);
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
    // Verificar si existen cajas asociadas al id_usuario
    const cajas = await Cajas.findAll({
      where: { id_usuario: id },
      transaction: t, // Asociar la transacción
    });

    if (cajas.length > 0) {
      // Si existen cajas, eliminarlas
      await Cajas.destroy({
        where: { id_usuario: id },
        transaction: t,
      });
    }

    // Obtener las listas asociadas al id_usuario
    const listas = await Lista.findAll({
      where: { id_usuario: id },
      attributes: ["id_lista"], // Solo obtener los id_lista
      transaction: t, // Asociar la transacción
    });

    // Eliminar las relaciones en productos_listas si existen
    if (listas.length > 0) {
      const idListas = listas.map((lista) => lista.id_lista);

      await ProductoLista.destroy({
        where: {
          id_lista: {
            [sequelize.Op.in]: idListas, // Usamos los id_lista obtenidos previamente
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
    const usuario = await Usuario.destroy({
      where: { id_usuario: id },
      returning: true, // Para obtener el usuario eliminado
      transaction: t,
    });

    if (usuario === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await t.commit(); // Confirmar la transacción
    res.status(200).json({
      mensaje: "Usuario y sus datos asociados eliminados correctamente",
    });
  } catch (err) {
    await t.rollback(); // Revertir si hay error
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el usuario y sus datos" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
