import express from 'express';
const router = express.Router();
import { handleSignup, handleLogin } from "./handler.js";

router.post("/signup", handleSignup);

router.post("/", handleLogin);

export default router;
