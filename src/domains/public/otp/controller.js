const OTP = require("./model");
const generateOtp = require("./../../../util/generateOtp");
const sendEmail = require("./../../../util/sendEmail");
const { hashData, verifyHashedData } = require("./../../../util/hashData");
const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
    try {
        if (!(email && otp)) {
            throw Error("Values for email and otp must be provided");
        }

        // nos aseguramos que el OTP exista
        const matchedOTPRecord = await OTP.findOne({
            email,
        });

        if (!matchedOTPRecord) {
            throw Error("No OTP record found");
        }

        const { expiresAt } = matchedOTPRecord;

        if (expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            throw Error("Code has expired. Please, request for a new one.")
        }

        const hashedOTP = await matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP); 

        return validOTP;

    } catch (error) {
        throw error;
    }
};

const sendOTP = async ({ email, subject, message, duration }) => {
    try {
        if (!(email && subject && message)) {
            throw Error("Missing values for email, subject or message");
        }

        // Limpiar otp records anteriores
        await OTP.deleteOne({ email });

        // Generar pin
        const generatedOtp = await generateOtp();

        // Enviar mail
        const emailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: `<p>${message}</p><p><b>${generatedOtp}</b></p><p>Este código expira en <b>${duration} hora(s)</b>.</p>`,
        };
        await sendEmail(emailOptions);

        // guardamos el OTP en nuestra DB
        const hashedOTP = await hashData(generatedOtp);
        const newOTP = await new OTP({
            email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 * +duration, //pasamos a ms
        });

        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP = async (email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };