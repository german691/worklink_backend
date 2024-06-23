const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");

const verifyUserEmail = async ({ email, otp }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });
        if (!validOTP) {
            throw Error("Invalid code passed. Check your inbox.")
        }

        // actualizar el user record para que muestre "verificado"

        await User.updateOne({ email }, { verified: true });

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

const sendVerificationOTPEmail = async (email) => {
    try {
        // vemos si existe el usuario
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("There is no user for the provided email.");
        };

        const otpDetails = {
            email,
            subject: "Email verification",
            message: "Verifica tu mail con el código a continuación:",
            duration: 1,
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendVerificationOTPEmail, verifyUserEmail };