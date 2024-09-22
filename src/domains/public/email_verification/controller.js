import User from "./../../auth/user/model.js";
import { sendOTP, verifyOTP, deleteOTP } from "./../otp/controller.js";

const verifyUserEmail = async ({ email, otp }) => {
  const validOTP = await verifyOTP({ email, otp });
  if (!validOTP) {
    throw new Error("Invalid code passed. Check your inbox.");
  }

  await User.updateOne({ email }, { verified: true });
  await deleteOTP(email);
};

const sendVerificationOTPEmail = async (email) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("There is no user for the provided email.");
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
