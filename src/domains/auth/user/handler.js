import { loginSchema, signupSchema } from "./../../../validation/userSchemes.js";
import { createNewUser, authenticateUser } from "./controller.js";
import { sendVerificationOTPEmail } from "./../../../domains/public/email_verification/controller.js";
import { handleErrorResponse } from "../../../util/errorHandler.js";

const handleSignup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const sendOtp = process.env.SEND_OTP === undefined ? 'false' : process.env.SEND_OTP.toLowerCase();
    // si sendOtp es "false" tonces "verified" es "true"
    // ya que no se envía un mail para verificarlo
    const verified = sendOtp === 'true' ? false : true;

    const newUser = await createNewUser({ ...value, verified });

    if (sendOtp === 'true') {
      await sendVerificationOTPEmail(value.email);
    }

    return res.status(200).json(newUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};


const handleLogin = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw error;
    }
    
    const { token, role } = await authenticateUser(value);
    return res.status(200).json({ token: token, role });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { handleSignup, handleLogin };
