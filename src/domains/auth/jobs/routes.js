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
  handleCreateCategory,
  handleGetCategories
} from "./handler.js"; 

// Public
router.get("/", handleGetJob); 
router.get("/:jobId", auth(["client", "worker", "admin"]), handleGetJobDetails); 
router.get("/:jobId/applicants", auth(["client", "worker", "admin"]), handleGetJobApplicants); 

// Client-admin
router.post("/", auth(["client", "admin"]), handlePostJob); 
router.delete("/:jobId", auth(["client", "admin"]), handleDropJob); 
router.put("/:jobId", auth(["client", "admin"]), handleEditJob); 
router.patch("/:jobId/start", auth(["client", "admin"]), handleSetFinalWorker); 
router.patch("/:jobId/finish", auth(["client", "admin"]), handleMarkJobAsCompleted); 

// Worker-admin
router.post("/:jobId/apply", auth(["worker", "admin"]), handleApplyToJob); 
router.delete("/:jobId/apply", auth(["worker", "admin"]), handleLeaveJob); 

// Categories
router.get("/categories", auth(["admin"]), handleGetCategories); 
router.post("/categories", auth(["admin"]), handleCreateCategory); 

export default router;
