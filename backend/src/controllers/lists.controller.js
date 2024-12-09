const pool = require("../config/db");

// Crear una lista
const createList = async (req, res) => {
  try {
    const { nombre_lista, estado_seguridad, id_usuario } = req.body;

    // Verificar si se proporciona un id_usuario
    if (!id_usuario) {
      return res
        .status(400)
        .json({ message: "El campo id_usuario es obligatorio." });
    }

    const query = `
        INSERT INTO listas (nombre_lista, estado_seguridad, id_usuario, fecha_creacion)
        VALUES ($1, $2, $3, NOW())
        RETURNING id_lista;
      `;

    const result = await pool.query(query, [
      nombre_lista,
      estado_seguridad,
      id_usuario,
    ]);

    const idLista = result.rows[0].id_lista;

    res.status(201).json({
      message: "Lista creada exitosamente.",
      id_lista: idLista,
    });
  } catch (err) {
    console.error("Error al crear la lista:", err);
    res.status(500).json({ message: "Error al crear la lista." });
  }
};

const addProductToList = async (req, res) => {
  try {
    const { id_lista, id_producto } = req.body;

    // Verificar si los campos id_lista y id_producto están presentes
    if (!id_lista || !id_producto) {
      return res
        .status(400)
        .json({ message: "id_lista y id_producto son obligatorios." });
    }

    // Obtener el id_usuario asociado a la lista
    const queryGetUser = `
        SELECT id_usuario FROM listas WHERE id_lista = $1;
      `;
    const resultUser = await pool.query(queryGetUser, [id_lista]);

    // Verificar si se encontró el id_usuario para esa lista
    if (resultUser.rows.length === 0) {
      return res.status(404).json({ message: "Lista no encontrada." });
    }

    const id_usuario = resultUser.rows[0].id_usuario;

    // Verificar que el id_producto sea válido
    const queryCheckProduct = `
        SELECT id_producto FROM productos WHERE id_producto = $1;
      `;
    const resultProduct = await pool.query(queryCheckProduct, [id_producto]);

    if (resultProduct.rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Insertar el producto en la tabla intermedia (productos_listas)
    const queryInsertProduct = `
        INSERT INTO productos_listas (id_lista, id_producto)
        VALUES ($1, $2);
      `;
    await pool.query(queryInsertProduct, [id_lista, id_producto]);

    res.status(201).json({
      message: "Producto agregado a la lista exitosamente.",
      id_lista,
      id_producto,
      id_usuario, // Opcional: incluir el id_usuario asociado
    });
  } catch (err) {
    console.error("Error al agregar el producto a la lista:", err);
    res
      .status(500)
      .json({ message: "Error al agregar el producto a la lista." });
  }
};

// Ver productos de una lista
const getProductsFromList = async (req, res) => {
  const { id_lista } = req.params;
  console.log("ID de lista recibido:", id_lista);

  try {
    const query = `
        SELECT p.id_producto, p.nombre_producto, p.precio_producto, p.descripcion_producto
        FROM productos p
        JOIN productos_listas pl ON p.id_producto = pl.id_producto
        WHERE pl.id_lista = $1;
      `;
    const result = await pool.query(query, [id_lista]);

    console.log(result.rows); // Agregar esto para ver el resultado de la consulta en el servidor

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos para esta lista.",
      });
    }

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      productos: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener los productos de la lista:", error);
    res.status(500).json({
      message: "Error al obtener los productos de la lista",
    });
  }
};

// Borrar producto de lista
const removeProductFromList = async (req, res) => {
  const { id_lista, id_producto } = req.body;

  try {
    // Verificar si los parámetros id_lista e id_producto están presentes
    if (!id_lista || !id_producto) {
      return res.status(400).json({
        message: "id_lista y id_producto son obligatorios",
      });
    }

    // Eliminar el producto de la lista en la tabla productos_listas
    const query = `
        DELETE FROM productos_listas
        WHERE id_lista = $1 AND id_producto = $2;
      `;
    const result = await pool.query(query, [id_lista, id_producto]);

    // Verificar si el producto fue eliminado exitosamente
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Producto no encontrado en la lista.",
      });
    }

    res.status(200).json({
      message: "Producto eliminado de la lista exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar el producto de la lista:", error);
    res.status(500).json({
      message: "Error al eliminar el producto de la lista",
    });
  }
};

// Eliminar una lista y sus productos asociados
const removeList = async (req, res) => {
  const { id_lista } = req.params;

  try {
    // Verificar si la lista existe antes de eliminarla
    const checkListQuery = `
        SELECT id_lista FROM listas WHERE id_lista = $1;
      `;
    const checkListResult = await pool.query(checkListQuery, [id_lista]);

    if (checkListResult.rows.length === 0) {
      return res.status(404).json({
        message: "Lista no encontrada.",
      });
    }

    // Eliminar productos asociados a la lista en productos_listas
    const deleteProductsFromListQuery = `
        DELETE FROM productos_listas WHERE id_lista = $1;
      `;
    await pool.query(deleteProductsFromListQuery, [id_lista]);

    // Eliminar la lista de la tabla listas
    const deleteListQuery = `
        DELETE FROM listas WHERE id_lista = $1;
      `;
    await pool.query(deleteListQuery, [id_lista]);

    res.status(200).json({
      message: "Lista y productos asociados eliminados exitosamente.",
    });
  } catch (error) {
    console.error("Error al eliminar la lista:", error);
    res.status(500).json({
      message: "Error al eliminar la lista.",
    });
  }
};

module.exports = {
  createList,
  addProductToList,
  getProductsFromList,
  removeProductFromList,
  removeList,
};
