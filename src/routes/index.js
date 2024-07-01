const express = require("express");
const router = express.Router();

// admin --------------------------------------------------------------------------

const adminRoute = require("./../domains/auth/admin");
router.use("/admin", adminRoute);

// auth ---------------------------------------------------------------------------

const jobsRoute = require("./../domains/auth/jobs");
router.use("/jobs", jobsRoute);

const userRoutes = require("./../domains/auth/user");
router.use("/user", userRoutes);

// public --------------------------------------------------------------------------

const statusRoute = require("./../domains/public/status");
router.use("/status", statusRoute);

const OTPRoutes = require("./../domains/public/otp");
router.use("/otp", OTPRoutes);

const EmailVerificationRoutes = require("./../domains/public/email_verification");
router.use("/email_verification", EmailVerificationRoutes);

const ForgotPasswordRoutes = require("./../domains/public/forgot_password");
router.use("/forgot_password", ForgotPasswordRoutes);

module.exports = router;