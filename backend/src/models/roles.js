const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Roles = sequelize.define(
  "Roles",
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_rol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

// Inicializar roles por defecto
async function initializeRoles() {
  const roles = ["Usuario", "Admin"];
  for (const rol of roles) {
    await Roles.findOrCreate({
      where: { nombre_rol: rol },
      defaults: { nombre_rol: rol },
    });
  }
  console.log("✅ Roles inicializados correctamente");
}

module.exports = { Roles, initializeRoles };
