const { sequelize } = require("../config/db");
const Cajas = require("../models/cajas");
const Producto = require("../models/productosGeneral");
const Venta = require("../models/venta");
const {MetodoPago} = require("../models/MetodoPago");
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

    // No devolver error si no hay cajas, solo devolver array vacío
    if (cajas.length === 0) {
      console.log("No se encontraron cajas para este usuario.");
      return res.status(200).json([]); // Devuelve un array vacío en lugar de un 404
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

    // Si la caja no tiene productos, devolvemos un array vacío en lugar de un error
    const productos = caja.Productos.map((producto) => ({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      cantidad: producto.ProductoCaja.cantidad, // Accedemos a la cantidad a través de la tabla intermedia
    }));

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      productos: productos.length > 0 ? productos : [], // Enviar array vacío si no hay productos
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
    nombre_caja,
    descripcion_caja,
    fecha_apertura,
    fecha_cierre,
    estado,
  } = req.body;

  const { id } = req.params; // ID de la caja

  // Validar que el ID sea válido
  if (!id || isNaN(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  try {
    // Buscar la caja para asegurarse de que existe
    const caja = await Cajas.findByPk(id);

    if (!caja) {
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }

    // Actualizar la caja con los nuevos datos
    await caja.update({
      nombre_caja,
      descripcion_caja,
      fecha_apertura,
      fecha_cierre,
      estado,
    });

    // Devolver la caja actualizada
    res.status(200).json({ mensaje: "Caja actualizada correctamente", caja });
  } catch (err) {
    console.error("Error al actualizar la caja:", err);
    res.status(500).json({ mensaje: "Error al actualizar la caja" });
  }
};

// 4. Boton eliminar caja
// Eliminar caja por id
const deleteBoxFromId = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ mensaje: "ID inválido" });
  }

  const t = await sequelize.transaction(); // Inicia la transacción

  try {
    // Buscar la caja con sus relaciones
    const caja = await Cajas.findByPk(id, { transaction: t });

    if (!caja) {
      await t.rollback();
      return res.status(404).json({ mensaje: "Caja no encontrada" });
    }

    // Eliminar todas las ventas asociadas a la caja
    await Venta.destroy({ where: { id_caja: id }, transaction: t });


    // Finalmente, eliminar la caja
    await caja.destroy({ transaction: t });

    await t.commit(); // Confirmar los cambios

    res.status(200).json({ mensaje: "Caja elimina da correctamente" });
  } catch (err) {
    await t.rollback(); // Revertir cambios si hay error
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
  console.log("Request recibido:", req.body);
  console.log("Usuario autenticado en req.user:", req.user);

  const { nombre_caja, fecha_apertura, estado = "abierto", productos = [] } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!nombre_caja || !fecha_apertura) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Validar que el usuario autenticado tenga un id_usuario
  if (!req.user || !req.user.id_usuario) {
    return res.status(400).json({ message: "Usuario no autenticado o id_usuario no encontrado" });
  }

  // Validar que la fecha_apertura sea una fecha válida
  const fechaValida = new Date(fecha_apertura);
  if (isNaN(fechaValida.getTime())) {
    return res.status(400).json({ message: "La fecha de apertura no es válida" });
  }

  // Validar que el estado sea "abierto" o "cerrado" (según tus necesidades)
  if (estado !== "abierto" && estado !== "cerrado") {
    return res.status(400).json({ message: "El estado debe ser 'abierto' o 'cerrado'" });
  }

  try {
    const { id_usuario } = req.user;
    console.log("ID del usuario autenticado:", id_usuario);

    // Crear la caja en la base de datos
    const nuevaCaja = await Cajas.create({
      nombre_caja,
      fecha_apertura: fechaValida,
      estado,  // Aquí se guardará "abierto"
      id_usuario,
    });

    // Si hay productos, procesarlos
    if (productos.length > 0) {
      // Validar que todos los productos tengan id_producto y cantidad
      const productosInvalidos = productos.filter(
        (producto) => !producto.id_producto || !producto.cantidad
      );

      if (productosInvalidos.length > 0) {
        return res.status(400).json({
          message: "Algunos productos no tienen id_producto o cantidad",
          productosInvalidos,
        });
      }

      // Guardar los productos en la tabla productoCaja
      for (const producto of productos) {
        const { id_producto, cantidad } = producto;
        await ProductoCaja.create({
          id_caja: nuevaCaja.id_caja,
          id_producto,
          cantidad,
        });
      }
    }

    res.status(201).json({
      message: "Caja creada exitosamente",
      id_caja: nuevaCaja.id_caja,
    });
  } catch (error) {
    console.error("Error al crear la caja:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


const getBoxById = async (req, res) => {
  const { id_caja } = req.params; // Recibir id_caja desde los parámetros de la URL

  console.log("ID de la caja recibido:", id_caja); // Verifica el valor recibido

  // Validar que el ID sea un número válido
  if (isNaN(id_caja)) {
    return res
      .status(400)
      .json({ message: "El ID de la caja debe ser un número válido." });
  }

  try {
    // Buscar la caja donde id_caja coincida
    const caja = await Cajas.findOne({
      where: { id_caja }, // Buscar por id_caja en la base de datos
    });

    // Si no se encuentra la caja
    if (!caja) {
      return res.status(404).json({ message: "Caja no encontrada." });
    }

    // Devolver la caja encontrada
    return res.status(200).json(caja);
  } catch (error) {
    console.error("Error al obtener la caja:", error);
    return res.status(500).json({ message: "Error al obtener la caja" });
  }
};

const getBoxDetails = async (req, res) => {
  const { id_caja } = req.params;
  console.log("ID de la caja recibido:", id_caja);

  try {
    // Obtener la caja y sus ventas
    const caja = await Cajas.findByPk(id_caja, {
      include: [{ model: Venta, include: [MetodoPago] }],
    });
    
    console.log("Caja con ventas:", JSON.stringify(caja, null, 2));
    
    if (!caja) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    // Calcular el total recaudado de las ventas de esta caja
    if (!caja.Venta || !Array.isArray(caja.Venta)) {
      return res.status(500).json({ error: "Las ventas de la caja no se encuentran disponibles." });
    }
    
    const totalRecaudado = caja.Venta.reduce((acc, venta) => acc + (venta.precio_producto), 0);

    // Agrupar los productos vendidos
    const { productosVendidos, totalProductosVendidos } = caja.Venta.reduce(
      (acc, venta) => {
        // Agrupar productos por nombre
        const productoIndex = acc.productosVendidos.findIndex(
          (p) => p.nombre_producto === venta.nombre_producto
        );
        if (productoIndex > -1) {
          acc.productosVendidos[productoIndex].cantidad += venta.cantidad;
        } else {
          acc.productosVendidos.push({
            nombre_producto: venta.nombre_producto,
            cantidad: venta.cantidad,
          });
        }

        // Sumar la cantidad total de productos vendidos
        acc.totalProductosVendidos += venta.cantidad;

        return acc;
      },
      { productosVendidos: [], totalProductosVendidos: 0 } // Estado inicial
    );

    // Agrupar los métodos de pago utilizados
    const metodosPago = caja.Venta.reduce((acc, venta) => {
      const metodoIndex = acc.findIndex(m => m.tipo_metodo_pago === venta.MetodoPago.tipo_metodo_pago);
      if (metodoIndex > -1) {
        acc[metodoIndex].monto += (venta.precio_producto);
      } else {
        acc.push({
          tipo_metodo_pago: venta.MetodoPago.tipo_metodo_pago,
          monto: (venta.precio_producto),
        });
      }
      return acc;
    }, []);

    // Calcular porcentajes
    const metodosPagoConPorcentaje = metodosPago.map(metodo => ({
      tipo_metodo_pago: metodo.tipo_metodo_pago,
      monto: metodo.monto,
      porcentaje: parseFloat(((metodo.monto / totalRecaudado) * 100).toFixed(2))
    }));

    res.json({
      totalRecaudado,
      productosVendidos,
      totalProductosVendidos,
      metodosPago: metodosPagoConPorcentaje,
    });
  } catch (error) {
    console.error("Error al obtener los detalles de la caja:", error);
    res.status(500).json({ error: "Error al obtener los detalles de la caja." });
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
  getBoxById,
  getBoxDetails,
};
