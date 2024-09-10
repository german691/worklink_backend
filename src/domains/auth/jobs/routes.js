import express from 'express';
const router = express.Router();
import  auth from "./../../../middleware/auth.js";
import { handlePostJob, handleGetJob, handleEditJob, handleDropJob, handleFinishJob, handleStartJob, handleApplyToWork, handleLeavingJob, handleCategorySetter, handleCategoryGetter } from "./handler.js"; 

router.get("/", auth(), handleGetJob);

router.post("/", auth(["client", "admin"]), handlePostJob);

router.delete("/", auth(["client", "admin"]), handleDropJob);

router.put("/", auth(["client", "admin"]), handleEditJob);

router.post("/start", auth(["client", "admin"]), handleStartJob);

router.post("/finish", auth(["client", "admin"]), handleFinishJob);

// worker
router.post("/apply", auth(["worker", "admin"]), handleApplyToWork);

router.post("/leave", auth(["worker", "admin"]), handleLeavingJob);

// admin 
router.get("/category", auth(["admin"]), handleCategoryGetter);

router.post("/category", auth(["admin"]), handleCategorySetter);

export default router;

