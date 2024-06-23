const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.status(200).send("Bienvenido al API Worklink");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;