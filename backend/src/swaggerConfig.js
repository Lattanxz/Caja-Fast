const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CajaFast API",
    version: "1.0.0",
    description: "API para gestionar cajas, productos y ventas.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Servidor local",
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
