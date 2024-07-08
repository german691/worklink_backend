const express = require("express");
const router = express.Router();
const { checkStatus } = require("./handler")

router.get("/", async (req, res) => {
    checkStatus();
});

module.exports = router;