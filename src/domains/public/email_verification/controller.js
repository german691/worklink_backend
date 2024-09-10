import User from "./../../auth/user/model.js";
import { sendOTP, verifyOTP, deleteOTP } from "./../otp/controller.js";

const verifyUserEmail = async ({ email, otp }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });
        if (!validOTP) {
            throw Error("Invalid code passed. Check your inbox.")
        }

        await User.updateOne({ email }, { verified: true });

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

const sendVerificationOTPEmail = async (email) => {
    try {
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

export { sendVerificationOTPEmail, verifyUserEmail };