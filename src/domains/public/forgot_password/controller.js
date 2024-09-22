import User from "./../../auth/user/model.js";
import { hashData } from "./../../../util/hashData.js";
import { sendOTP, deleteOTP, verifyOTP } from "./../otp/controller.js";

const sendPasswordResetOTPEmail = async (email) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("There's no account for the provided email");
  }

  if (!existingUser.verified) {
    throw new Error("This email hasn't been verified yet. Check your inbox.");
  }

  const otpDetails = {
    email,
    subject: "Password Reset",
    message: "Enter the code below to reset your password",
    duration: 1,
  };

  return sendOTP(otpDetails);
};

const resetUserPassword = async ({ email, otp, newPassword }) => {
  const validOtp = await verifyOTP({ email, otp });
  if (!validOtp) {
    throw new Error("Invalid code passed. Check your inbox.");
  }

  const hashedNewPassword = await hashData(newPassword);
  await User.updateOne({ email }, { password: hashedNewPassword });
  await deleteOTP(email);
};

export { sendPasswordResetOTPEmail, resetUserPassword };
