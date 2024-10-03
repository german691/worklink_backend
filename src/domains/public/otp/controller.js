import OTP from "./model.js";
import generateOtp from "./../../../util/generateOtp.js";
import { hashData, verifyHashedData } from "./../../../util/hashData.js";
import { handleError } from "../../../util/errorHandler.js";
const { AUTH_EMAIL, SEND_OTP } = process.env;

const sendOTP = async ({ email, subject, message, duration }) => {
  if (!(email && subject && message)) {
    return handleError("Missing values for email, subject or message", 400);
  }

  // Eliminar cualquier OTP existente para este correo
  await OTP.deleteOne({ email });

  const generatedOtp = await generateOtp();

  const emailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject,
    html: `<p>${message}</p><p><b>${generatedOtp}</b></p><p>Este código expira en <b>${duration} hora(s)</b>.</p>`,
  };

  // Importar condicionalmente el módulo sendEmail si SEND_OTP es 'true'
  if (SEND_OTP === 'true') {
    const { default: sendEmail } = await import("./../../../util/sendEmail.js");
    await sendEmail(emailOptions);
  }

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
    return handleError("Values for email and otp must be provided", 400);
  }

  const matchedOTPRecord = await OTP.findOne({ email });

  if (!matchedOTPRecord) {
    return handleError("OTP record found", 404);
  }

  const { expiresAt } = matchedOTPRecord;

  if (expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    return handleError("Code has expired. Please, request for a new one", 410);
  }

  const hashedOTP = matchedOTPRecord.otp;
  return verifyHashedData(otp, hashedOTP);
};

const deleteOTP = async (email) => {
  await OTP.deleteOne({ email });
};

export { sendOTP, verifyOTP, deleteOTP };
