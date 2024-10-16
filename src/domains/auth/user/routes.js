import express from 'express';
const router = express.Router();
import { handleSignup, handleLogin, handleGetUserInfo } from "./handler.js";
import auth from '../../../middleware/auth.js';

router.post("/signup", handleSignup);
router.post("/", handleLogin);
router.get("/me", auth(), handleGetUserInfo);

export default router;
