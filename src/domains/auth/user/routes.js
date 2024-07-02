const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../../../domains/public/email_verification/controller");

router.post("/", async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!(username || email)) throw new Error('username or email empty');

        user = username ? username : email;

        if (!user) throw new Error('Invalid credentials');

        if (!password) {
            throw new Error('Expected a password');
        }

        const authenticatedUser = await authenticateUser({ user, password });

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post("/signup", async (req, res) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,24}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    const nameRegex = /^[a-z ,.'-]+$/i;
    const userTypes = ["worker", "client"];
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/; //iso8601

    try {
        let { 
            username, 
            email, 
            password, 
            userType,
            name,
            surname, 
            birthdate,
        } = req.body;

        username = username.trim().toLowerCase();
        email = email.trim();
        password = password.trim(); 
        userType = userType.trim().toLowerCase(); 

        if (!(username && email && password && name && surname && birthdate)) {
            throw Error("Empty input fields");
        } else if (!usernameRegex.test(username)) {
            throw Error("Username can only contain alphanumeric characters, underscores, and hyphens")
        } else if (!emailRegex.test(email)) {
            throw Error("Invalid email");
        } else if (!passwordRegex.test(password)) {
            throw Error("Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character");
        } else if (!userTypes.includes(userType)){
            throw Error('Invalid user type. "worker" or "client" expected.');
        } else if (!dateRegex.test(birthdate)){
            throw Error(`Invalid birthdate format. expected iso8601 format, got ${birthdate}`);
        } else if (!(nameRegex.test(name) && nameRegex.test(surname))){
            throw Error(`Expected a valid name, got ${name} ${surname}`);
        } else {
            const newUser = await createNewUser({
                username, 
                email, 
                password, 
                userType,
                name,
                surname, 
                birthdate,
            });

            await sendVerificationOTPEmail(email);

            res.status(200).json(newUser);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;