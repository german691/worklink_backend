import { sendOTP, verifyOTP } from "./controller.js";
import { handleErrorResponse } from "../../../util/errorHandler.js";

const sendOTPHandler = async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;
    const createdOTP = await sendOTP({ email, subject, message, duration });

    return res.status(200).json(createdOTP);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

const verifyOTPHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOTP = await verifyOTP({ email, otp });
    return res.status(200).json({ valid: validOTP });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { sendOTPHandler, verifyOTPHandler };
