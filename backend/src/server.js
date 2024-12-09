const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Middleware global para el cuerpo de la solicitud

// Ruta base para probar el servidor
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

// Swagger para la documentación interactiva
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Importar las rutas
const routes = require("./routes/index.js");
const userRoutes = require("./routes/users.routes");
const boxesRoutes = require("./routes/boxes.routes");
const paymentMethodRoutes = require("./routes/paymentMethod.routes");
const productRoutes = require("./routes/products.routes");
const salesRoutes = require("./routes/sales.routes");
const listsRoutes = require("./routes/lists.routes");

const { updateStatistics } = require("./controllers/sales.controller");

app.use("/api/sales", async (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log("Se ha realizado una venta, actualizando estadísticas...");

    await updateStatistics();
  }
  next();
});

// Rutas de la API
app.use("/api", routes);
app.use("/api/users", userRoutes);
app.use("/api/boxes", boxesRoutes);
app.use("/api/paymentMethod", paymentMethodRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/lists", listsRoutes);

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
