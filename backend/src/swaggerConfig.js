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
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Caja: {
        type: "object",
        properties: {
          id_caja: {
            type: "integer",
            description: "ID de la caja (auto-generado en la base de datos)",
          },
          nombre_caja: {
            type: "string",
            description: "Nombre de la caja",
          },
          fecha_creacion: {
            type: "string",
            format: "date",
            description: "Fecha de creación de la caja",
          },
          id_usuario: {
            type: "integer",
            description: "ID del usuario que creó la caja (extraído del token)",
          },
        },
        required: ["nombre_caja", "fecha_creacion"], // Si 'id_usuario' es extraído del token, no es obligatorio en el cuerpo
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Aquí se indican las rutas donde Swagger buscará los comentarios de los endpoints
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
