import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
const { PORT } = process.env;

const startApp = () => {
  app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Worklink Backend is up and running at: ${url}/api/status`);

    const { SEND_OTP } = process.env;

    const sendOtp = SEND_OTP === undefined ? 'false' : SEND_OTP.toLowerCase();
  
    if (sendOtp === 'false') {
      console.log("Nodemailer is disabled by the user. Users will be verified by default.");
    } else if (sendOtp === 'true') {
      console.log("Nodemailer is enabled.");
    }

  });
};

startApp();
