const pool = require("../config/db");

const obtainBoxes = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM Cajas");
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener cajas" });
  }
};

// Obtener todos los productos de una caja especifica
const getProductsFromBox = async (req, res) => {
  const { id_caja } = req.params; // Obtenemos el id de la caja desde los parámetros de la ruta

  try {
    const query = `
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.precio_producto,
        pc.cantidad
      FROM 
        producto_caja pc
      JOIN 
        productos p ON pc.id_producto = p.id_producto
      WHERE 
        pc.id_caja = $1;
    `;

    const result = await pool.query(query, [id_caja]);

    // Si no se encuentran productos en la caja, devolvemos un mensaje adecuado
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos para esta caja.",
      });
    }

    // Devolvemos los productos encontrados en la caja junto con la cantidad
    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      productos: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener los productos de la caja:", error);
    res.status(500).json({
      message: "Error al obtener los productos de la caja",
    });
  }
};

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

module.exports = { obtainBoxes, getProductsFromBox, updateBox };
