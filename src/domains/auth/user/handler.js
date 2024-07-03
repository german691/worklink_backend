const { loginSchema, signupSchema } = require("./../../../validation/userSchemes");
const { createNewUser, authenticateUser } = require("./controller");
const { sendVerificationOTPEmail } = require("./../../../domains/public/email_verification/controller");

const handleSignup = async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            throw Error(error.details[0].message);
        }
        
        const newUser = await createNewUser(value);

        const { email } = value;
        await sendVerificationOTPEmail(email);

        console.log(email);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const handleLogin = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        
        const token = await authenticateUser(value);

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { handleSignup, handleLogin };