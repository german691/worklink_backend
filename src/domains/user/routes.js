const express = require("express");
const router = express.Router();
const { createNewUser, autenticateUser } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../../domains/email_verification/controller");

router.get("/create_post", auth, (req, res) => {
    try {
        let { postBody, postTitle, postImg } = req.body;

        if (!(postBody && postTitle && postImg)) {
            throw Error("Empty postBody or postTitle");
        } 

        if (postBody.lenght > 300) {
            throw Error("postTitle must be less than 300 chars");
        }

        if (postTitle.lenght > 33) {
            throw Error("postTitle must be less than 33 chars");
        }        

    } catch (error) {
        res.status(400).json(error.message);
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!(email && password)) {
            throw Error("Empty input fields");
        } 

        const autenticatedUser = await autenticateUser({email, password});

        res.status(200).json(autenticatedUser);
    } catch (error) {
        res.status(400).json(error.message);
    }
})

//Signup
router.post("/signup", async (req, res) => {
    const alphabethRegex = /^[a-zA-Z ]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    try {
        let { name, email, password, userType } = req.body;

        name = name.trim();
        email = email.trim();
        password = password.trim(); 
        userType = userType.trim(); 

        if (!(name && email && password)) {
            throw Error("Empty input fields");
        } else if (!alphabethRegex.test(name)) {
            throw Error("Name can only contain alphabet caracters")
        } else if (!emailRegex.test(email)) {
            throw Error("Invalid email entered")
        } else if (password.lenght < 8) {
            throw Error("Password is too short")
        } else {
            const newUser = await createNewUser({
                name,
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