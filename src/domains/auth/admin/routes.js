import express from 'express';
const router = express.Router();
import auth from "./../../../middleware/auth.js";
import { handleAdminLogin, handleAdminRegister } from './handlers/authHandler.js';
import { handleUserInfoGetter } from './handlers/userHandler.js';

router.post("/auth", handleAdminLogin);

router.post("/register", handleAdminRegister);

//rutas para testing
//ver info de usuario pero con id encriptada
router.get("/user_info", auth(["admin"]), handleUserInfoGetter);

export default router;