const express = require("express");
const router = express.Router();
const auth = require("./../../../middleware/auth");
const { handleSignup, handleLogin } = require("./handler");

router.post("/signup", handleSignup);

router.post("/", handleLogin);

module.exports = router;