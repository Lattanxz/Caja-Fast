const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Especifica el origen permitido
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Permite el envío de cookies y encabezados de autenticación
  })
);

app.use(express.json()); // Middleware global para el cuerpo de la solicitud
app.use(cookieParser());
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
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

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
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
