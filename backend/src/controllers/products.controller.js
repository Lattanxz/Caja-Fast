const pool = require("../config/db");
const ProductoCaja = require("../models/productoCaja");
const Producto = require("../models/productosGeneral");
// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      attributes: ["id_producto", "nombre_producto"], // Devuelve id y nombre
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Productos WHERE ID_Producto = $1;";
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

// Crear un producto
const createProduct = async (req, res) => {
  const { Nombre_Producto, Precio_Producto, Descripcion_Producto } = req.body;
  const query = `
    INSERT INTO Productos (Nombre_Producto, Precio_Producto, Descripcion_Producto)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      Nombre_Producto,
      Precio_Producto,
      Descripcion_Producto,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear el producto" });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { Nombre_Producto, Precio_Producto, Descripcion_Producto } = req.body;
  const query = `
    UPDATE Productos
    SET Nombre_Producto = $1, Precio_Producto = $2, Descripcion_Producto = $3
    WHERE ID_Producto = $4 RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      Nombre_Producto,
      Precio_Producto,
      Descripcion_Producto,
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { ID_Producto, ID_Caja } = req.params;
  const { Cantidad } = req.body;

  if (!ID_Producto || !ID_Caja || !Cantidad) {
    return res.status(400).json({ mensaje: "Faltan parámetros." });
  }

  try {
    const queryGet = `
      SELECT Cantidad 
      FROM Producto_caja 
      WHERE ID_Producto = $1 AND ID_Caja = $2;
    `;
    const resultGet = await pool.query(queryGet, [ID_Producto, ID_Caja]);

    if (resultGet.rowCount === 0) {
      return res
        .status(404)
        .json({ mensaje: "Producto no encontrado en la caja." });
    }

    const cantidadActual = resultGet.rows[0].cantidad;

    if (Cantidad > cantidadActual) {
      return res.status(400).json({
        mensaje: "La cantidad a reducir es mayor que la cantidad actual.",
      });
    }

    if (Cantidad === cantidadActual) {
      const queryDelete = `
        DELETE FROM Producto_caja
        WHERE ID_Producto = $1 AND ID_Caja = $2
        RETURNING *;
      `;
      const resultDelete = await pool.query(queryDelete, [
        ID_Producto,
        ID_Caja,
      ]);

      return res.status(200).json({
        mensaje: "El producto fue completamente eliminado de la caja.",
        data: resultDelete.rows[0],
      });
    } else {
      const queryUpdate = `
        UPDATE Producto_caja
        SET Cantidad = Cantidad - $1
        WHERE ID_Producto = $2 AND ID_Caja = $3
        RETURNING *;
      `;
      const resultUpdate = await pool.query(queryUpdate, [
        Cantidad,
        ID_Producto,
        ID_Caja,
      ]);

      return res.status(200).json({
        mensaje: "Cantidad del producto reducida correctamente en la caja.",
        data: resultUpdate.rows[0],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Error al reducir la cantidad del producto en la caja",
    });
  }
};

const addProductToBox = async (req, res) => {
  const { id_producto, id_caja, cantidad } = req.body;

  try {
    // Validar que los campos requeridos estén presentes
    if (!id_producto || !id_caja || !cantidad) {
      return res.status(400).json({
        mensaje: "Faltan datos: id_producto, id_caja y cantidad son requeridos",
      });
    }

    // Crear un registro en la tabla producto_caja
    const productoCaja = await ProductoCaja.create({
      id_producto,
      id_caja,
      cantidad,
    });

    // Devolver el registro creado
    res.status(201).json({
      mensaje: "Producto agregado a la caja con éxito",
      data: productoCaja,
    });
  } catch (err) {
    console.error("Error al agregar el producto a la caja:", err);
    res.status(500).json({
      mensaje: "Error al agregar el producto a la caja",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToBox,
};
