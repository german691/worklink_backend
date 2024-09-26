import { handleErrorResponse } from "../../../util/errorHandler.js";
import { verifyUserEmail, sendVerificationOTPEmail } from "./controller.js";

const OTPMailHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!(email && otp)) {
      throw new Error("Empty otp details are not allowed");
    }

    await verifyUserEmail({ email, otp });
    return res.status(200).json({ email, verify: true });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

const emailVerifyHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("An email is required");
    }

    const createdEmailVerificationOTP = await sendVerificationOTPEmail(email);
    return res.status(200).json(createdEmailVerificationOTP);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { OTPMailHandler, emailVerifyHandler };
