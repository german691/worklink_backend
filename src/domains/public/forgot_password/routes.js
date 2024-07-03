const express = require("express");
const router = express.Router();
const { pwdOTPHandler, pwdResetHandler } = require("./handler");

router.post("/", async (req, res) => {
    await pwdOTPHandler(req, res);
});

router.post("/reset", async (req, res) => {
    await pwdResetHandler(req, res);
});

module.exports = router;