import User from "./../../auth/user/model.js";
import { hashData } from "./../../../util/hashData.js";
import { sendOTP, deleteOTP, verifyOTP } from "./../otp/controller.js";

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

    const hashedNewPassword = await hashData(newPassword);
    await User.updateOne({ email }, { password: hashedNewPassword });
    
    await deleteOTP(email);
    return;
  } catch (error) {
    throw error;
  }
};

export { sendPasswordResetOTPEmail, resetUserPassword };