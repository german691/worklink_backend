const express = require("express");
const router = express.Router();

// admin --- no implementado

// auth 
const jobsRoute = require("./../domains/auth/jobs");
const userRoutes = require("./../domains/auth/user");

// public
const statusRoute = require("./../domains/public/status");
const OTPRoutes = require("./../domains/public/otp");
const EmailVerificationRoutes = require("./../domains/public/email_verification");
const ForgotPasswordRoutes = require("./../domains/public/forgot_password");

router.use("/jobs", jobsRoute);
router.use("/status", statusRoute);
router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

module.exports = router;