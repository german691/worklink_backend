import express from 'express';
const router = express.Router();
import { sendOTPHandler, verifyOTPHandler } from "./handler.js";

router.post("/", async (req, res) => {
  await sendOTPHandler(req, res);
});

router.post("/verify", async (req, res) => {
  await verifyOTPHandler(req, res); 
});

export default router;
