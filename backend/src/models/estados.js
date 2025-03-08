const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Estados = sequelize.define(
  "Estados",
  {
    id_estado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_estado: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "estados",
    timestamps: false,
  }
);

// Inicializar estados por defecto
async function initializeEstados() {
  const estados = ["Activo", "Inactivo", "Suspendido"];
  for (const estado of estados) {
    await Estados.findOrCreate({
      where: { nombre_estado: estado },
      defaults: { nombre_estado: estado },
    });
  }
  console.log("✅ Estados inicializados correctamente");
}

module.exports = { Estados, initializeEstados };
