const pool = require("../config/db");
const Producto = require("../models/productosGeneral");
const Lista = require("../models/lista");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      attributes: ["id_producto", "nombre_producto", "descripcion_producto", "precio_producto"] // Devuelve id y nombre
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
  const { nombre_producto, precio_producto, descripcion_producto } = req.body;

  console.log('Datos recibidos:', req.body); // Verifica qué datos están llegando

  if (!nombre_producto || !precio_producto || !descripcion_producto) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
  }

  try {
    const product = await Producto.create({
      nombre_producto,
      precio_producto,
      descripcion_producto,
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
    // Buscar el producto en la base de datos
    const product = await Producto.findByPk(id_producto);

    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    // Eliminar el producto
    await product.destroy();

    return res.status(200).json({
      mensaje: "El producto fue eliminado correctamente.",
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
