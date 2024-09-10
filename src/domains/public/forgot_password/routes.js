import express from 'express';
const router = express.Router();
import  { pwdOTPHandler, pwdResetHandler } from "./handler.js";

router.post("/", async (req, res) => {
    await pwdOTPHandler(req, res);
});

router.post("/reset", async (req, res) => {
    await pwdResetHandler(req, res);
});

export default router;
