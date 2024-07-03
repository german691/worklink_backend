const express = require("express");
const router = express.Router();
const { sendOTPHandler, verifyOTPHandler } = require("./handler");

router.post("/", async (req, res) => {
    await sendOTPHandler(req, res);
});

router.post("/verify", async (req, res) => {
    await verifyOTPHandler(req, res); 
});

module.exports = router;