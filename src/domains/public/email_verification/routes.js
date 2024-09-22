import express from 'express';
const router = express.Router();
import { OTPMailHandler, emailVerifyHandler } from "./handler.js";

router.post("/verify", async (req, res) => {
  await OTPMailHandler(req, res);
});

router.post("/", async (req, res) => {
  await emailVerifyHandler(req, res);
})

export default router;
