const express = require("express");
const router = express.Router();
const { OTPMailHandler, emailVerifyHandler } = require("./handler");

router.post("/verify", async (req, res) => {
    await OTPMailHandler(req, res);
});

router.post("/", async (req, res) => {
    await emailVerifyHandler(req, res);
})

module.exports = router;