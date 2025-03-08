const {MetodoPago} = require("../models/MetodoPago");

const getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await MetodoPago.findAll();
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los métodos de pago" });
  }
};

module.exports = {
  getAllPaymentMethods,  // Asegúrate de exportar la función
};
