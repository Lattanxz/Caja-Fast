const pool = require("../config/db");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  const query = "SELECT nombre_producto FROM productos;"; // Seleccionamos solo los nombres de los productos
  try {
    const result = await pool.query(query);

    // Extraemos solo los nombres de los productos
    const productos = result.rows.map((row) => row.nombre_producto);

    // Enviamos el arreglo de nombres de productos como respuesta JSON
    res.status(200).json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener los productos" });
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
