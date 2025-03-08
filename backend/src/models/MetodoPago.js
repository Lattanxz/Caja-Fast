const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la configuración de la base de datos

const MetodoPago = sequelize.define(
  "MetodoPago",
  {
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria
      autoIncrement: true, // Se autoincrementa
    },
    tipo_metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // Evita duplicados
    },
    descripcion: {
      type: DataTypes.TEXT, // Descripción opcional del método de pago
      allowNull: true, // Puede ser nulo
    },
  },
  {
    tableName: "metodo_pago", // Nombre de la tabla en la base de datos
    timestamps: false, // No agrega createdAt y updatedAt
  }
);

async function initializeMetodoPago() {
  const metodos = ["Credito", "Debito", "Efectivo", "Transferencia"];
  for (const metodo of metodos) {
    await MetodoPago.findOrCreate({
      where: { tipo_metodo_pago: metodo },
      defaults: { tipo_metodo_pago: metodo },
    });
  }
  console.log("✅ Métodos de pago inicializados correctamente");
}

module.exports = { MetodoPago, initializeMetodoPago };