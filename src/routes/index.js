import express from 'express';
const router = express.Router();

// admin --------------------------------------------------------------------------
import adminRoutes from "../domains/auth/admin/index.js";
router.use("/admin", adminRoutes);

// auth ---------------------------------------------------------------------------
import jobsRoutes from "../domains/auth/jobs/index.js";
router.use("/jobs", jobsRoutes);

import userRoutes from "../domains/auth/user/index.js";
router.use("/user", userRoutes);

// public --------------------------------------------------------------------------
import statusRoutes from "../domains/public/status/index.js";
router.use("/status", statusRoutes);

import otpRoutes from "../domains/public/otp/index.js";
router.use("/otp", otpRoutes);

import emailVerificationRoutes from "../domains/public/email_verification/index.js";
router.use("/email_verification", emailVerificationRoutes);

import forgotPasswordRoutes from "../domains/public/forgot_password/index.js";
router.use("/forgot_password", forgotPasswordRoutes);

export default router;
