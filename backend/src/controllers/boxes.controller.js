const { sequelize } = require("../config/db");
const Cajas = require("../models/cajas");
const ProductoCaja = require("../models/productoCaja");
const Producto = require("../models/productosGeneral");
const Venta = require("../models/venta");
const { Op } = require("sequelize");

// 1. Obtener cajas para ponerla en la pagina
// Obtener todas las cajas de un usuario por id_usuario
const getBoxesByUserId = async (req, res) => {
  const { id_usuario } = req.params;

  console.log("ID del usuario recibido:", id_usuario); // Verifica el valor recibido

  // Validar que el ID sea un número válido
  if (isNaN(id_usuario)) {
    return res
      .status(400)
      .json({ message: "El ID del usuario debe ser un número válido." });
  }
  try {
    // Buscar todas las cajas donde id_usuario coincida
    const cajas = await Cajas.findAll({
      where: { id_usuario },
    });

    // Verificar si hay resultados
    if (cajas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron cajas para este usuario" });
    }

    // Devolver las cajas encontradas
    return res.status(200).json(cajas);
  } catch (error) {
    console.error("Error al obtener las cajas:", error);
    return res.status(500).json({ message: "Error al obtener las cajas" });
  }
};

// 2. Boton ver detalles de caja
// Obtener todos los productos de una caja especifica
const getProductsFromBox = async (req, res) => {
  const { id_caja } = req.params; // Obtenemos el id de la caja desde los parámetros de la ruta

  try {
    // Buscamos la caja junto con los productos a través de la relación Many-to-Many
    const caja = await Cajas.findOne({
      where: { id_caja },
      include: {
        model: Producto,
        through: { attributes: ["cantidad"] }, // Incluir la cantidad de la tabla intermedia
      },
    });

    // Si no se encuentra la caja, devolvemos un error 404
    if (!caja) {
      return res.status(404).json({
        message: "Caja no encontrada.",
      });
    }

    // Si la caja no tiene productos, devolvemos un mensaje adecuado
    if (caja.Productos.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos para esta caja.",
      });
    }

    // Devolvemos los productos de la caja con la cantidad
    const productos = caja.Productos.map((producto) => ({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      cantidad: producto.ProductoCaja.cantidad, // Accedemos a la cantidad a través de la tabla intermedia
    }));

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      productos,
    });
  } catch (error) {
    console.error("Error al obtener los productos de la caja:", error);
    res.status(500).json({
      message: "Error al obtener los productos de la caja",
    });
  }
};

// 3. Boton gestionar
// actualizar box
const updateBox = async (req, res) => {
  console.log("Datos recibidos:", req.body); // Verifica que los datos están llegando correctamente

  // Extraer los datos del body
  const {
    Nombre_Caja,
    Descripcion_Caja,
    Fecha_Apertura,
    Fecha_Cierre,
    Estado,
  } = req.body;

  // Validar que todos los campos necesarios estén presentes
  if (
    !Nombre_Caja ||
    !Descripcion_Caja ||
    !Fecha_Apertura ||
    !Fecha_Cierre ||
    Estado === undefined
  ) {
    return res.status(400).json({
      mensaje: "Faltan campos requeridos",
      detalles:
        "Es necesario enviar todos los campos: Nombre_Caja, Descripcion_Caja, Fecha_Apertura, Fecha_Cierre, Estado",
    });
  }

  const { id } = req.params; // ID de la caja

  console.log(`Actualizando la caja con ID: ${id}`); // Verifica que el ID está llegando

  // Consulta SQL para actualizar la caja en la base de datos
  const query = `
    UPDATE Cajas
    SET Nombre_Caja = $1, Descripcion_Caja = $2, Fecha_Apertura = $3, Fecha_Cierre = $4, Estado = $5
    WHERE id_caja = $6
    RETURNING *;
  `;

  try {
    // Ejecutar la consulta en la base de datos
    const result = await pool.query(query, [
      Nombre_Caja,
      Descripcion_Caja,
      Fecha_Apertura,
      Fecha_Cierre,
      Estado,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }

    // Devolver la caja actualizada
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar la caja" });
  }
};

// 4. Boton eliminar caja
// Eliminar caja por id
const deleteBoxFromId = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ mensaje: "ID inválido" }); // Cambio a 'mensaje' para consistencia
  }

  const t = await sequelize.transaction(); // Inicia la transacción

  try {
    // Eliminar las relaciones en la tabla ProductoCaja
    await ProductoCaja.destroy({
      where: { id_caja: id },
      transaction: t, // Asocia la transacción a la operación
    });

    // Eliminar las relaciones en la tabla Venta
    await Venta.destroy({
      where: { id_caja: id },
      transaction: t, // Asocia la transacción a la operación
    });

    // Eliminar la caja
    const caja = await Cajas.findByPk(id);
    if (!caja) {
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }

    await caja.destroy({ transaction: t }); // Eliminar la caja de la tabla Cajas

    // Confirmar los cambios en la transacción
    await t.commit();

    res.status(200).json({ mensaje: "Caja eliminada correctamente" });
  } catch (err) {
    // Si ocurre un error, revertir la transacción
    await t.rollback();
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar la caja" });
  }
};

// 5. Agregar producto a la caja
// Función para agregar un producto a una caja
const addProductToBox = async (req, res) => {
  const { id_caja } = req.params; // Obtener el id de la caja de los parámetros de la URL
  const { id_producto, cantidad } = req.body; // Obtener el id del producto y la cantidad de la solicitud

  try {
    // Buscar la caja por su id
    const caja = await Cajas.findByPk(id_caja);
    if (!caja) {
      return res.status(404).json({ message: "Caja no encontrada." });
    }

    // Buscar el producto por su id
    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Verificar si el producto ya está en la caja
    const productoExistente = await ProductoCaja.findOne({
      where: {
        id_caja: id_caja,
        id_producto: id_producto,
      },
    });

    if (productoExistente) {
      // Si ya existe, actualizar la cantidad
      productoExistente.cantidad += cantidad; // Sumar la cantidad
      await productoExistente.save();
      return res
        .status(200)
        .json({ message: "Cantidad del producto actualizada." });
    }

    // Si no existe, agregar el producto con la cantidad indicada
    await caja.addProducto(producto, { through: { cantidad } });

    return res
      .status(200)
      .json({ message: "Producto agregado a la caja correctamente." });
  } catch (error) {
    console.error("Error al agregar el producto a la caja:", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al agregar el producto a la caja." });
  }
};

// 6. Borrar producto de una caja
const deleteProductFromBox = async (req, res) => {
  const { id_caja, id_producto } = req.params; // Recibimos los parámetros desde la URL
  const { cantidad } = req.query; // Recibimos la cantidad desde los parámetros de consulta
  const cantidadEliminar = Number(cantidad) || 1; // Si no se envía, se elimina 1 por defecto

  console.log(
    `ID Caja: ${id_caja}, ID Producto: ${id_producto}, Cantidad: ${cantidadEliminar}`
  );

  try {
    // Asegúrate de que tanto id_caja como id_producto sean números válidos
    if (isNaN(id_caja) || isNaN(id_producto)) {
      return res
        .status(400)
        .json({ message: "ID de caja o producto inválido." });
    }

    // Buscar el producto en la caja
    const productoEnCaja = await ProductoCaja.findOne({
      where: { id_caja: id_caja, id_producto: id_producto },
    });

    if (!productoEnCaja) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en la caja." });
    }

    // Restar la cantidad y verificar si se debe eliminar el registro
    if (productoEnCaja.cantidad > cantidadEliminar) {
      productoEnCaja.cantidad -= cantidadEliminar;
      await productoEnCaja.save();
    } else {
      await productoEnCaja.destroy();
    }

    return res
      .status(200)
      .json({ message: "Producto actualizado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto parcialmente:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 7. Crear Caja
const createBox = async (req, res) => {
  const { nombre_caja, fecha_creacion, estado = true } = req.body; // Valor predeterminado

  // Validar que los campos estén completos
  if (!nombre_caja || !fecha_creacion) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    // Obtener el id_usuario del usuario autenticado
    const { id_usuario } = req.user; // Este valor fue agregado por el middleware
    console.log("ID del usuario autenticado:", id_usuario);

    // Crear la caja en la base de datos
    const nuevaCaja = await Cajas.create({
      nombre_caja,
      fecha_creacion,
      estado, // Si no se pasa, será `true` por defecto
      id_usuario, // Asociar la caja al usuario autenticado
    });

    res
      .status(201)
      .json({ message: "Caja creada exitosamente", caja: nuevaCaja });
  } catch (error) {
    console.error("Error al crear la caja:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getProductsFromBox,
  updateBox,
  getBoxesByUserId,
  deleteBoxFromId,
  addProductToBox,
  deleteProductFromBox,
  createBox,
};
