const { verifyUserEmail, sendVerificationOTPEmail } = require("./controller");

const OTPMailHandler = async  (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!(email && otp)) throw Error("Empty otp details are not allowed");

        await verifyUserEmail({ email, otp });
        res.status(200).json({ email, verify: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const emailVerifyHandler = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) throw Error("An email is required");

        const createdEmailVerificationOTP = await sendVerificationOTPEmail(email);
        res.status(200).json(createdEmailVerificationOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { OTPMailHandler, emailVerifyHandler };