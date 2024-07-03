const express = require("express");
const router = express.Router();
const auth = require("./../../../middleware/auth");
const { handleSignup, handleLogin } = require("./handler");

router.post("/signup", async (req, res) => {
    await handleSignup(req, res);
})

router.post("/", async (req, res) => {
    await handleLogin(req, res);
})

module.exports = router;