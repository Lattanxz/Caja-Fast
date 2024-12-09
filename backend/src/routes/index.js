const express = require("express");
const router = express.Router();
const db = require("../config/db");

const boxesRoutes = require("./boxes.routes");
const usersRoutes = require("./users.routes");
const paymentMethodRoutes = require("./paymentMethod.routes");
const productRoutes = require("./products.routes");
const salesRoutes = require("./sales.routes");
const listsRoutes = require("./lists.routes");

router.use("/boxes", boxesRoutes);
router.use("/users", usersRoutes);
router.use("/paymentMethod", paymentMethodRoutes);
router.use("/products", productRoutes);
router.use("/sales", salesRoutes);
router.use("/lists", listsRoutes);

module.exports = router;
