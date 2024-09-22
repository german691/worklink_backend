import express from 'express';
const router = express.Router();
import auth from "./../../../middleware/auth.js";
import { handlePostJob, handleGetJob, handleGetJobDetails, handleGetJobApplicants, handleEditJob, handleDropJob, handleFinishJob, handleStartJob, handleApplyToWork, handleLeavingJob, handleCategorySetter, handleCategoryGetter } from "./handler.js"; 

// public
router.get("/", handleGetJob); //ok

router.get("/:jobId", auth(["client", "worker", "admin"]), handleGetJobDetails); //ok
router.get("/:jobId/applicants", auth(["client", "worker", "admin"]), handleGetJobApplicants); //ok

// client-admin
router.post("/", auth(["client", "admin"]), handlePostJob); //ok

router.delete("/:jobId", auth(["client", "admin"]), handleDropJob); //ok

router.put("/:jobId", auth(["client", "admin"]), handleEditJob); //ok

router.patch("/:jobId/start", auth(["client", "admin"]), handleStartJob); //ok

router.patch("/:jobId/finish", auth(["client", "admin"]), handleFinishJob); //ok

// worker-admin
router.post("/:jobId/apply", auth(["worker", "admin"]), handleApplyToWork); //ok

router.delete("/:jobId/apply", auth(["worker", "admin"]), handleLeavingJob); //ok

// categories
router.get("/categories", auth(["admin"]), handleCategoryGetter); //ok

router.post("/categories", auth(["admin"]), handleCategorySetter); //ok

export default router;

