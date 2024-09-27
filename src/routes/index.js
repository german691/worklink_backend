import express from 'express';
const router = express.Router();
import adminRoutes from "../domains/auth/admin/index.js";
import jobsRoutes from "../domains/auth/jobs/index.js";
import userRoutes from "../domains/auth/user/index.js";
import statusRoutes from "../domains/public/status/index.js";
import otpRoutes from "../domains/public/otp/index.js";
import emailVerificationRoutes from "../domains/public/email_verification/index.js";
import forgotPasswordRoutes from "../domains/public/forgot_password/index.js";

// admin --------------------------------------------------------------------------
router.use("/admin", adminRoutes);

// auth ---------------------------------------------------------------------------
router.use("/jobs", jobsRoutes);

router.use("/user", userRoutes);

// public --------------------------------------------------------------------------
router.use("/status", statusRoutes);

router.use("/otp", otpRoutes);

router.use("/email_verification", emailVerificationRoutes);

router.use("/forgot_password", forgotPasswordRoutes);

export default router;
