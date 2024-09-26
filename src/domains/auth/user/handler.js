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
    
    const newUser = await createNewUser(value);
    await sendVerificationOTPEmail(value.email);

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
    
    const token = await authenticateUser(value);
    return res.status(200).json({ token: token });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { handleSignup, handleLogin };
