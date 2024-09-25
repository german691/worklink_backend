import { loginSchema, signupSchema } from "./../../../validation/userSchemes.js";
import { createNewUser, authenticateUser } from "./controller.js";
import { sendVerificationOTPEmail } from "./../../../domains/public/email_verification/controller.js";

const handleSignup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    
    const newUser = await createNewUser(value);
    await sendVerificationOTPEmail(value.email);

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message }); 
  }
};

const handleLogin = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    
    const token = await authenticateUser(value);
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { handleSignup, handleLogin };
