const User = require("./../user/model");
const { hashData } = require("./../../util/hashData");
const { sendOTP, deleteOTP, verifyOTP } = require("./../otp/controller");

const sendPasswordResetOTPEmail = async (email) => {
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("There's no account for the provided email");
        };

        if (!existingUser.verified) {
            throw Error("This email hasn't been verified yet. Check your inbox.");
        };

        const otpDetails = {
            email,
            subject: "Password Reset",
            message: "Enter the code below to reset your password",
            duration: 1,
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

const resetUserPassword = async ({ email, otp, newPassword }) => {
    try {
        const validOtp = await verifyOTP({ email, otp });
        if (!validOtp) {
            throw Error("Invalid code passed. Check your inbox.")
        }

        if (newPassword.length < 8) {
            throw Error("Password is too short");
        }

        const hashedNewPassword = await hashData(newPassword);
        await User.updateOne({ email }, { password: hashedNewPassword });
        
        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendPasswordResetOTPEmail, resetUserPassword };