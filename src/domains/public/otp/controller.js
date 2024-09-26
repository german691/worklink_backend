import OTP from "./model.js";
import generateOtp from "./../../../util/generateOtp.js";
import sendEmail from "./../../../util/sendEmail.js";
import { hashData, verifyHashedData } from "./../../../util/hashData.js";
const { AUTH_EMAIL } = process.env;

const sendOTP = async ({ email, subject, message, duration }) => {
  if (!(email && subject && message)) {
    const error = new Error("Missing values for email, subject or message");
    error.status = 400;
    throw error;
  }

  await OTP.deleteOne({ email });
  const generatedOtp = await generateOtp();
  const emailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject,
    html: `<p>${message}</p><p><b>${generatedOtp}</b></p><p>Este código expira en <b>${duration} hora(s)</b>.</p>`,
  };

  await sendEmail(emailOptions);

  const hashedOTP = await hashData(generatedOtp);
  const newOTP = new OTP({
    email,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000 * +duration,
  });

  return newOTP.save();
};

const verifyOTP = async ({ email, otp }) => {
  if (!(email && otp)) {
    const error = new Error("Values for email and otp must be provided");
    error.status = 400;
    throw error;
  }

  const matchedOTPRecord = await OTP.findOne({ email });

  if (!matchedOTPRecord) {
    const error = new Error("No OTP record found");
    error.status = 404;
    throw error;
  }

  const { expiresAt } = matchedOTPRecord;

  if (expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("Code has expired. Please, request for a new one.");
  }

  const hashedOTP = matchedOTPRecord.otp;
  return verifyHashedData(otp, hashedOTP);
};

const deleteOTP = async (email) => {
  await OTP.deleteOne({ email });
};

export { sendOTP, verifyOTP, deleteOTP };


