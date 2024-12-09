const pool = require("../config/db");

const getAllPaymentMethods = async (req, res) => {
  const query = "SELECT * FROM Metodo_Pago;";
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error); // Esto ayuda a ver detalles del error en la consola
    res.status(500).json({ mensaje: "Error al obtener los métodos de pago" });
  }
};

module.exports = {
  getAllPaymentMethods,
};
