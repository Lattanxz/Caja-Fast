const {Roles} = require("../models/roles");

const getRoleById = async (req, res) => {
    try {
      const { id_rol } = req.params;
      
      const role = await Roles.findByPk(id_rol);
  
      if (!role) {
        return res.status(404).json({ message: "Rol no encontrado" });
      }
  
      res.json(role);
    } catch (error) {
      console.error("Error al obtener el rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  module.exports = { getRoleById };