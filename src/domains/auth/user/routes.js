const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../../../domains/public/email_verification/controller");

router.post("/login", async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!(username || email)) {
            throw new Error('Expected a username or email');
        }
        
        if (username && email) {
            throw new Error('Expected only a username or email, not both');
        }

        if (!password) {
            throw new Error('Expected a password');
        }

        if (username) {
            username = username.trim();
        }
        
        if (email) {
            email = email.trim();
        }

        const authenticatedUser = await authenticateUser({ username, email, password });

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post("/signup", async (req, res) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,24}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-z ,.'-]+$/i;
    const userTypes = ["worker", "client"];
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/; //iso8601
    const dniArgentinaRegex = /^\d{7,8}$/;
    
    try {
        let { 
            username, 
            email, 
            password, 
            userType,
            name,
            surname, 
            dni,
            birthdate,
        } = req.body;

        username = username.trim().toLowerCase();
        email = email.trim();
        password = password.trim(); 
        userType = userType.trim().toLowerCase(); 
        dni = dni.trim();

        if (!(username && email && password)) {
            throw Error("Empty input fields");
        } else if (!usernameRegex.test(username)) {
            throw Error("username can only contain alphabet caracters")
        } else if (!emailRegex.test(email)) {
            throw Error("Invalid email entered");
        } else if (password.length < 8) {
            throw Error("Password is too short");
        } else if (!userTypes.includes(userType)){
            throw Error("Invalid user type, expected 'worker' or 'client'");
        } else if (!dateRegex.test(birthdate)){
            throw Error(`Invalid birthdate format. Expected ISO8601 format, got ${birthdate}`);
        } else if (!(nameRegex.test(name) && nameRegex.test(surname))){
            throw Error(`Expected a valid name, got ${name} ${surname}`);
        } else if (!dniArgentinaRegex.test(dni)) {
            throw Error(`Expected a DNI, only numbers, no spaces, between 7 and 8 digits`);
        } else {
            const newUser = await createNewUser({
                username, 
                email, 
                password, 
                userType,
                name,
                surname, 
                dni,
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