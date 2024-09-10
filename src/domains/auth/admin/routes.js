import express from 'express';
const router = express.Router();
import auth from "./../../../middleware/auth.js";
import { handleAdminLogin, handleAdminRegister, handleUserInfoGetter } from "./handler.js";

router.post("/auth", handleAdminLogin);

router.post("/register", handleAdminRegister);

//rutas para testing
//ver info de usuario pero con id encriptada
router.get("/user_info", auth(["admin"]), handleUserInfoGetter);

export default router;