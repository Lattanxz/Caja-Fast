const ProductoLista = require("../models/productoLista");

const createUnion = async (req, res) => {
  const { productos, id_lista } = req.body;

  if (!productos || !Array.isArray(productos)) {
    return res.status(400).json({ message: "Lista de productos inválida" });
  }

  try {
    // Filtrar productos duplicados por id_producto
    const productosUnicos = productos.filter(
      (value, index, self) =>
        index === self.findIndex((p) => p.id_producto === value.id_producto)
    );

    const productosLista = await Promise.all(
      productosUnicos.map(async (producto) => {
        const existe = await ProductoLista.findOne({
          where: {
            id_producto: producto.id_producto,
            id_lista,
          },
        });

        if (!existe) {
          return await ProductoLista.create({
            id_producto: producto.id_producto,
            id_lista,
          });
        }
        return null;
      })
    );

    // Filtramos los productos que fueron creados realmente
    const productosCreados = productosLista.filter((p) => p !== null);

    res.status(201).json(productosCreados);
  } catch (err) {
    console.error("Error al crear producto_lista:", err);
    res.status(500).json({ message: "Error al guardar el producto en la lista." });
  }
};

const deleteUnion = async (req, res) => {
  const { id_lista, id_producto } = req.params;

  try {
    const result = await ProductoLista.destroy({
      where: { id_lista, id_producto }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en la lista' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto de la lista:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createUnion,
  deleteUnion
};
