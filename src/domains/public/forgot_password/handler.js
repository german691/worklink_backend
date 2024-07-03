const { sendPasswordResetOTPEmail, resetUserPassword } = require("./controller");
const { resetPwdSchema } = require("./../../../validation/publicSchemes");

const pwdOTPHandler = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw Error("An email is required in order to recover password");
        }
        
        const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email);
        res.status(200).json(createdPasswordResetOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const pwdResetHandler = async (req, res) => {
    try {
        const { error, value } = resetPwdSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        
        const { email } = value;

        await resetUserPassword(value);
        res.status(200).json({ email, reset: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


module.exports = { pwdOTPHandler, pwdResetHandler };