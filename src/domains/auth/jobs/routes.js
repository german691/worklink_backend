import express from 'express';
const router = express.Router();
import auth from "./../../../middleware/auth.js";
import {
  handlePostJob,
  handleGetJob,
  handleGetJobDetails,
  handleGetJobApplicants,
  handleEditJob,
  handleDropJob,
  handleMarkJobAsCompleted,
  handleSetFinalWorker,
  handleApplyToJob,
  handleLeaveJob,
  handleGetCategories
} from "./handler.js"; 

// Public
router.get("/", auth(), handleGetJob); 
router.get("/:jobId", auth(), handleGetJobDetails); 
router.get("/:jobId/applicants", auth(), handleGetJobApplicants); 

// Client-admin
router.post("/", auth(["client"]), handlePostJob); 
router.delete("/:jobId", auth(["client"]), handleDropJob); 
router.put("/:jobId", auth(["client"]), handleEditJob); 
router.patch("/:jobId/start", auth(["client"]), handleSetFinalWorker); 
router.patch("/:jobId/finish", auth(["client"]), handleMarkJobAsCompleted); 

// Worker-admin
router.post("/:jobId/apply", auth(["worker"]), handleApplyToJob); 
router.delete("/:jobId/apply", auth(["worker"]), handleLeaveJob); 

// Categories
router.get("/categories", auth(["admin"]), handleGetCategories); 

export default router