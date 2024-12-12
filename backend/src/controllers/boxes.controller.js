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

// Obtener todas las cajas de un usuario por id_usuario
const getBoxesByUserId = async (req, res) => {
  const { id_usuario } = req.params;
  console.log("ID del usuario recibido:", id_usuario); // Verifica que sea un número y no null o undefined

  if (isNaN(id_usuario)) {
    return res
      .status(400)
      .json({ message: "El ID del usuario debe ser un número válido." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM cajas WHERE id_usuario = $1",
      [id_usuario]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron cajas para este usuario" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener las cajas" });
  }
};

// Controlador para crear una caja con productos
const createBoxWithProducts = async (req, res) => {
  const { nombreCaja, productosSeleccionados } = req.body; // Asumiendo que recibimos el nombre de la caja y los productos seleccionados
  console.log(nombreCaja, productosSeleccionados);
  // Validar que se recibieron los datos necesarios
  if (
    !nombreCaja ||
    !productosSeleccionados ||
    productosSeleccionados.length === 0
  ) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos necesarios para crear la caja" });
  }

  const client = await pool.connect(); // Obtener un cliente de la base de datos para manejar transacciones

  try {
    await client.query("BEGIN"); // Comenzar una transacción

    // Paso 1: Insertar la nueva caja (sin productos por ahora)
    const resultCaja = await client.query(
      "INSERT INTO cajas (nombre_caja) VALUES ($1) RETURNING id_caja",
      [nombreCaja]
    );
    const idCaja = resultCaja.rows[0].id_caja; // Obtener el ID de la nueva caja

    // Paso 2: Insertar los productos en la tabla intermedia productos_caja
    const insertProductoCajaPromises = productosSeleccionados.map(
      (productoId) => {
        return client.query(
          "INSERT INTO productos_caja (id_caja, id_producto) VALUES ($1, $2)",
          [idCaja, productoId]
        );
      }
    );

    // Ejecutar todas las inserciones de productos
    await Promise.all(insertProductoCajaPromises);

    await client.query("COMMIT"); // Confirmar la transacción
    res
      .status(200)
      .json({ mensaje: "Caja creada con productos correctamente" });
  } catch (err) {
    await client.query("ROLLBACK"); // Si algo falla, revertir todo
    console.error("Error al crear la caja con productos:", err);
    res.status(500).json({ mensaje: "Error al crear la caja con productos" });
  } finally {
    client.release(); // Liberar el cliente de la base de datos
  }
};

module.exports = {
  obtainBoxes,
  getProductsFromBox,
  updateBox,
  getBoxesByUserId,
  createBoxWithProducts,
};
