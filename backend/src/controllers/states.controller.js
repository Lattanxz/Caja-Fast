const { Estados } = require("../models/estados"); // Asegúrate de importar el modelo correcto

const getStateById = async (req, res) => {
  try {
    const { id_estado } = req.params;
    const estado = await Estados.findByPk(id_estado);

    if (!estado) {
      return res.status(404).json({ message: "Estado no encontrado" });
    }

    res.json(estado);
  } catch (error) {
    console.error("Error al obtener el estado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { getStateById };
