import { sendPasswordResetOTPEmail, resetUserPassword } from "./controller.js";
import resetPwdSchema from "./../../../validation/publicSchemes.js";
import { handleErrorResponse } from "../../../util/errorHandler.js";

const pwdOTPHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("An email is required in order to recover password");
    }

    const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email);
    return res.status(200).json(createdPasswordResetOTP);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

const pwdResetHandler = async (req, res) => {
  try {
    const { error, value } = resetPwdSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    await resetUserPassword(value);
    return res.status(200).json({ email: value.email, reset: true });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { pwdOTPHandler, pwdResetHandler };
