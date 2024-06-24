const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../../domains/email_verification/controller");

router.post("/login", async (req, res) => {
    try {
        if (req.currentUser.userId) {
            res.status(200).send("user session is active");
            return;
        }

        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!(email && password)) {
            throw Error("Empty input fields");
        } 

        const authenticatedUser = await authenticateUser({email, password});

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json(error.message);
    }
})

router.post("/signup", async (req, res) => {
    const alphabethRegex = /^[a-zA-Z ]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
        if (req.currentUser.userId) {
            res.status(200).send("user session is active");
            return;
        }

        let { username, email, password, userType } = req.body;

        username = username.trim();
        email = email.trim();
        password = password.trim(); 
        userType = userType.trim(); 

        if (!(username && email && password)) {
            throw Error("Empty input fields");
        } else if (!alphabethRegex.test(username)) {
            throw Error("username can only contain alphabet caracters")
        } else if (!emailRegex.test(email)) {
            throw Error("Invalid email entered")
        } else if (password.length < 8) {
            throw Error("Password is too short")
        } else {
            const newUser = await createNewUser({
                username,
                email,
                password,
                userType
            });
            await sendVerificationOTPEmail(email);
            res.status(200).json(newUser);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;