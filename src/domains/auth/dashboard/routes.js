const express = require("express");
const router = express.Router();
const { authenticateAdmin, createNewAdmin } = require("./controller");
const auth = require("./../../../middleware/auth");

router.post("/auth", async (req, res) => {
    try {
        let { username, password } = req.body;

        if (!username) throw new Error('Invalid username');

        if (!password) throw new Error('Invalid password');

        const authenticatedUser = await authenticateAdmin({ username, password });

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post("/register", async (req, res) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,24}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

    try {
        const { username, password } = req.body; 
        const key = req.headers["x-admin-key"];

        if (!(username && usernameRegex.test(username))) {
            throw new Error("Username can only contain alphanumeric characters, underscores, and hyphens");
        } else if (!(password && passwordRegex.test(password))) {
            throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character");
        } else if (key !== process.env.ADMIN_KEY) {
            throw new Error("Invalid key");
        }

        const newAdmin = await createNewAdmin({ username, password });

        res.status(200).json(newAdmin);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;