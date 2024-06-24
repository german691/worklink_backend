const express = require("express");
const router = express.Router();

const jobsRoute = require("./../domains/jobs");
const statusRoute = require("./../domains/status");
const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");
const ForgotPasswordRoutes = require("./../domains/forgot_password");

router.use("/jobs", jobsRoute);
router.use("/status", statusRoute);
router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

module.exports = router;