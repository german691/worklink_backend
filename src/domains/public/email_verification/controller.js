import User from "./../../auth/user/model.js";
import { sendOTP, verifyOTP, deleteOTP } from "./../otp/controller.js";

const verifyUserEmail = async ({ email, otp }) => {
  const validOtp = await verifyOTP({ email, otp });
  if (!validOtp) {
    const error = new Error("Invalid code passed. Please check your inbox, or request a new code.");
    error.status = 422;
    throw error;
  }

  await User.updateOne({ email }, { verified: true });
  await deleteOTP(email);
};

const sendVerificationOTPEmail = async (email) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const error = new Error("No account found associated with the provided email");
    error.status = 404;
    throw error;
  }

  const otpDetails = {
    email,
    subject: "Email verification",
    message: "Verifica tu mail con el código a continuación:",
    duration: 1,
  };
  
  return sendOTP(otpDetails);
};

export { sendVerificationOTPEmail, verifyUserEmail };
