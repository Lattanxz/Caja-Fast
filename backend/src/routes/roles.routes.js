const express = require("express");
const { getRoleById } = require("../controllers/roles.controller");
const router = express.Router();

router.get("/:id_rol", getRoleById);

module.exports = router;
