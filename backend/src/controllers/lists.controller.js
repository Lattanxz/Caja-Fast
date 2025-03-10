const pool = require("../config/db");
const Listas = require("../models/lista");
const Producto = require("../models/productosGeneral");
const ProductoLista = require("../models/productoLista");
const Caja = require("../models/cajas");
const Venta = require("../models/venta");

// Crear una lista
const createList = async (req, res) => {
  const { nombre_lista, estado_seguridad, id_usuario, productos } = req.body;

  if (!id_usuario) {
    return res
      .status(400)
      .json({ message: "El campo id_usuario es obligatorio." });
  }

  try {
    // Crear la nueva lista
    const nuevaLista = await Listas.create({
      nombre_lista,
      estado_seguridad,
      id_usuario,
      fecha_creacion: new Date()
    });

    if (productos && productos.length > 0) {
      // Asociar productos a la lista en la tabla intermedia producto_lista
      const productosLista = productos.map((producto) => ({
        id_lista: nuevaLista.id_lista,
        id_producto: producto.id_producto // Accedemos al id_producto dentro del objeto
      }));
      
      await ProductoLista.bulkCreate(productosLista);
    }

    res.status(201).json({
      message: "Lista creada con productos exitosamente.",
      id_lista: nuevaLista.id_lista
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
    const lista = await Listas.findOne({
      where: { id_lista },
      include: [
        {
          model: Producto,
          through: { attributes: [] }, // Excluimos atributos de la tabla intermedia
          attributes: ['id_producto', 'nombre_producto', 'precio_producto', 'descripcion_producto']
        }
      ]
    });

    if (!lista) {
      return res.status(200).json({
        message: "No hay ninguna lista creada aún.",
        productos: []
      });
    }

    if (lista.Productos.length === 0) {
      return res.status(200).json({
        message: "Esta lista no tiene productos aún.",
        productos: []
      });
    }

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      productos: lista.Productos
    });
  } catch (error) {
    console.error("Error al obtener los productos de la lista:", error);
    res.status(500).json({
      message: "Error al obtener los productos de la lista"
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
    // Verificar si hay ventas asociadas a la lista en cajas abiertas
    const countCajasAbiertas = await Venta.count({
      where: { id_lista },  // Filtra por la lista
      include: {
        model: Caja,
        where: { estado: 'abierto' },  // Verifica que la caja esté abierta
        required: true, // Realiza el INNER JOIN con la tabla Caja
      },
    });

    // Si existen ventas asociadas a una caja abierta, no se puede eliminar la lista
    if (countCajasAbiertas > 0) {
      return res.status(400).json({
        message: "No se puede eliminar la lista porque tiene ventas asociadas a cajas abiertas. Debe cerrarse la caja primero.",
      });
    }

    // Verificar si la lista existe
    const list = await Listas.findOne({ where: { id_lista } });

    if (!list) {
      return res.status(404).json({
        message: "Lista no encontrada.",
      });
    }

    // Eliminar productos asociados a la lista
    await ProductoLista.destroy({ where: { id_lista } });

    // Eliminar la lista
    await list.destroy();

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




const getAllLists = async (req, res) => {
  try {
    // Extraemos `id_usuario` de req.query en lugar de `req.user`
    const { id_usuario } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ message: "Falta el ID del usuario" });
    }

    // Obtener solo las listas del usuario autenticado
    const listas = await Listas.findAll({
      where: { id_usuario },
      include: [
        {
          model: Producto,
          through: { attributes: [] }, // No incluir atributos de la tabla intermedia
          attributes: ["id_producto", "nombre_producto"],
        },
      ],
      order: [["id_lista", "ASC"], [Producto, "nombre_producto", "ASC"]],
    });

    // Transformar los datos para coincidir con el formato esperado
    const listsWithProducts = listas.map((lista) => ({
      id_lista: lista.id_lista,
      nombre_lista: lista.nombre_lista,
      productos: lista.Productos.map((producto) => ({
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
      })),
    }));

    res.status(200).json(listsWithProducts);
  } catch (error) {
    console.error("Error al obtener las listas y sus productos:", error);
    res.status(500).json({ message: "Error al obtener las listas" });
  }
};

const generateList = async (req, res) => {
  const { nombre_lista } = req.body;
  const { id_usuario } = req.user; // Extraemos el id_usuario del token (req.user)

  if (!nombre_lista) {
    return res
      .status(400)
      .json({ error: "El nombre de la lista es obligatorio" });
  }

  const transaction = await sequelize.transaction();
  try {
    // Crear la lista
    const nuevaLista = await Lista.create(
      {
        nombre_lista,
        fecha_creacion: new Date(),
        estado_seguridad: true,
      },
      { transaction }
    );

    // Insertar el id_usuario en listas_usuarios
    await ListaUsuario.create(
      {
        id_lista: nuevaLista.id_lista,
        id_usuario,
      },
      { transaction }
    );

    await transaction.commit(); // Confirma la transacción

    res.status(201).json({
      id_lista: nuevaLista.id_lista,
      nombre_lista: nuevaLista.nombre_lista,
      fecha_creacion: nuevaLista.fecha_creacion,
      estado_seguridad: nuevaLista.estado_seguridad,
    });
  } catch (err) {
    await transaction.rollback(); // Si algo falla, deshace la transacción
    console.error("Error al crear la lista:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateListName = async (req, res) => {
  const { id_lista } = req.params;
  const { nombre_lista } = req.body;

  try {
      const list = await Listas.findOne({ where: { id_lista } });

      if (!list) {
          return res.status(404).json({ message: "Lista no encontrada." });
      }

      list.nombre_lista = nombre_lista;
      await list.save();

      res.status(200).json({ message: "Nombre de la lista actualizado correctamente." });
  } catch (error) {
      console.error("Error al actualizar la lista:", error);
      res.status(500).json({ message: "Error al actualizar la lista." });
  }
};

const getListsByUser = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    console.log("Buscando listas para el usuario:", id_usuario);
    const listas = await Lista.findAll({ where: { id_usuario } });
    console.log("Listas encontradas:", listas);

    if (listas.length === 0) {
      return res.status(404).json({ message: "No hay ninguna lista creada aún.", productos: [] });
    }

    res.json(listas);
  } catch (error) {
    console.error("Error al obtener listas:", error);
    res.status(500).json({ message: "Error al obtener las listas." });
  }
};


module.exports = {
  createList,
  addProductToList,
  getProductsFromList,
  removeProductFromList,
  removeList,
  getAllLists,
  generateList,
  updateListName,
  getListsByUser,
};
