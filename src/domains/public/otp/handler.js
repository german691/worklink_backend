import { sendOTP, verifyOTP } from "./controller.js";

const sendOTPHandler = async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;
    const createdOTP = await sendOTP({ email, subject, message, duration });
    return res.status(200).json(createdOTP);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const verifyOTPHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOTP = await verifyOTP({ email, otp });
    return res.status(200).json({ valid: validOTP });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export { sendOTPHandler, verifyOTPHandler };
