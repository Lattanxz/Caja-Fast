const pool = require("../config/db");

const obtainUsers = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM Usuarios");
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

module.exports = { obtainUsers };
