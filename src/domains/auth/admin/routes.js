const express = require("express");
const router = express.Router();
const auth = require("./../../../middleware/auth");
const { handleAdminLogin, handleAdminRegister, handleUserInfoGetter } = require("./handler");

router.post("/auth", handleAdminLogin);

router.post("/register", handleAdminRegister);

//rutas para testing
//ver info de usuario pero con id encriptada
router.get("/user_info", auth(["admin"]), handleUserInfoGetter);

module.exports = router;