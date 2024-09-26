import User from "./../../auth/user/model.js";
import { hashData } from "./../../../util/hashData.js";
import { sendOTP, deleteOTP, verifyOTP } from "./../otp/controller.js";

const sendPasswordResetOTPEmail = async (email) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const error = new Error("No account found associated with the provided email");
    error.status = 404;
    throw error;
  }

  if (!existingUser.verified) {
    const error = new Error("This email hasn't been verified yet. Please check your inbox, or request a new code");
    error.status = 403;
    throw error;
  }

  const otpDetails = {
    email,
    subject: "Password Reset",
    message: "Enter the code below to reset your password",
    duration: 1,
  };

  return sendOTP(otpDetails);
};

const resetUserPassword = async ({ email, otp, password }) => {
  const validOtp = await verifyOTP({ email, otp });
  if (!validOtp) {
    const error = new Error("Invalid code passed. Please check your inbox, or request a new code.");
    error.status = 422;
    throw error;
  }

  const hashedNewPassword = await hashData(password);
  await User.updateOne({ email }, { password: hashedNewPassword });
  await deleteOTP(email);
};

export { sendPasswordResetOTPEmail, resetUserPassword };
