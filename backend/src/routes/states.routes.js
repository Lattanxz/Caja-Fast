const express = require("express");
const { getStateById } = require("../controllers/states.controller");

const router = express.Router();

router.get("/:id_estado", getStateById);

module.exports = router;
