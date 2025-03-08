const express = require("express");
const router = express.Router();
const ListProductController = require("../controllers/listProducts.controller");

router.post("/", ListProductController.createUnion);

router.delete('/:id_lista/:id_producto', ListProductController.deleteUnion);

module.exports = router;