const pool = require("../config/db");
const Producto = require("../models/productosGeneral");
const Lista = require("../models/lista");
const ProductoLista = require("../models/productoLista");
const Venta = require("../models/venta");
const Caja = require("../models/cajas");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  const id_usuario = req.headers["x-user-id"]; // Obtener el id_usuario desde los encabezados de la solicitud

  console.log('ID de usuario en backend:', id_usuario); // Verificar si se obtiene correctamente el id_usuario

  if (!id_usuario) {
    return res.status(400).json({ mensaje: "El ID del usuario es obligatorio." });
  }

  try {
    const productos = await Producto.findAll({
      where: {
        id_usuario: id_usuario, // Filtrar los productos por id_usuario
      },
      attributes: ["id_producto", "nombre_producto", "descripcion_producto", "precio_producto"],
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};



// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id_producto } = req.params; // Utilizamos id_producto en lugar de id

  try {
    // Buscar el producto por su id_producto
    const producto = await Producto.findByPk(id_producto, {
      attributes: ["id_producto", "nombre_producto", "precio_producto", "descripcion_producto"] // Asegura que estos campos se devuelvan
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Responder con el producto encontrado
    res.status(200).json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

const createProduct = async (req, res) => {
  const { nombre_producto, precio_producto, descripcion_producto, id_usuario } = req.body;

  console.log('Datos recibidos:', req.body); // Verifica qué datos están llegando

  // Validar que todos los campos sean proporcionados
  if (!nombre_producto || !precio_producto || !descripcion_producto || !id_usuario) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
  }

  try {
    const product = await Producto.create({
      nombre_producto,
      precio_producto,
      descripcion_producto,
      id_usuario, // Asignar el id_usuario a la creación del producto
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear el producto" });
  }
};



// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id_producto } = req.params; // id_producto en lugar de id
  const { nombre_producto, precio_producto, descripcion_producto } = req.body; // nombres en minúsculas

  try {
    // Buscar el producto por su id_producto
    const product = await Producto.findByPk(id_producto);

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Actualizar los campos del producto
    product.nombre_producto = nombre_producto;
    product.precio_producto = precio_producto;
    product.descripcion_producto = descripcion_producto;

    // Guardar los cambios en la base de datos
    await product.save();

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar el producto" });
  }
};


const deleteProduct = async (req, res) => {
  const { id_producto } = req.params;

  if (!id_producto) {
    return res.status(400).json({ mensaje: "Faltan parámetros." });
  }

  try {
    // Buscar si el producto está asociado a una lista
    const productoLista = await ProductoLista.findOne({ where: { id_producto } });
    const id_lista = productoLista?.id_lista;

    // Si el producto no está en ninguna lista, se borra directamente
    if (!id_lista) {
      await Producto.destroy({ where: { id_producto } });
      return res.status(200).json({
        mensaje: "El producto fue eliminado completamente porque no estaba en ninguna lista.",
      });
    }

    // Verificar si el producto es el último en la lista
    const countProductos = await ProductoLista.count({ where: { id_lista } });

    if (countProductos === 1) {
      // Si es el último producto de la lista, verificamos si la lista está asociada a una caja abierta
      const countCajasAbiertas = await Venta.count({
        where: { id_lista },
        include: {
          model: Caja,
          where: { estado: "abierto" },
          required: true,
        },
      });

      if (countCajasAbiertas > 0) {
        return res.status(400).json({
          mensaje:
            "No se puede eliminar el producto ni la lista porque la lista está asociada a una caja abierta.",
        });
      }

      // Si no está en una caja abierta, eliminamos el producto y la lista
      await Lista.destroy({ where: { id_lista } });
      await Producto.destroy({ where: { id_producto } });

      return res.status(200).json({
        mensaje: "El producto y la lista fueron eliminados correctamente.",
      });
    }

    // Si no es el último producto, solo eliminamos el producto de la lista
    await ProductoLista.destroy({ where: { id_producto } });

    return res.status(200).json({
      mensaje: "El producto fue eliminado de la lista correctamente.",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensaje: "Error al eliminar el producto.",
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

// Obtener productos por lista
const getProductsByListId = async (req, res) => {
  const { id_lista } = req.params; // ID de la lista desde los parámetros

  try {
    // Buscar la lista e incluir los productos asociados mediante ProductoLista
    const lista = await Lista.findOne({
      where: { id_lista },
      include: [
        {
          model: Producto,
          through: { attributes: [] }, // No necesitamos atributos de la tabla intermedia
          attributes: ['id_producto', 'nombre_producto', 'precio_producto'], // Atributos de Producto que quieres devolver
        }
      ]
    });

    if (!lista) {
      return res.status(404).json({ mensaje: "Lista no encontrada" });
    }

    res.status(200).json(lista.Productos); // Enviar los productos asociados
  } catch (error) {
    console.error("Error al obtener productos por lista:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToBox,
  getProductsByListId,
};
