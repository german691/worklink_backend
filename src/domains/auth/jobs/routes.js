const express = require("express");
const router = express.Router();
const auth = require("./../../../middleware/auth");
const { handlePostJob, handleGetJob, handleEditJob, handleDropJob, handleFinishJob, handleApplyToWork, handleLeavingJob, handleCategorySetter, handleCategoryGetter } = require("./handler"); 

// routes for clients
// add, list, edit, delete jobs

router.get("/", auth(), async (req, res) => {
    handleGetJob(req, res);
});

router.post("/", auth(["client", "admin"]), (req, res) => {
    handlePostJob(req, res);
});

router.delete("/", auth(["client", "admin"]), async (req, res) => {
    handleDropJob(req, res);
});

router.put("/", auth(["client", "admin"]), async (req, res) => {
    handleEditJob(req, res);
});

router.post("/start", auth(["client", "admin"]), async (req, res) => {
    handleStartJob(req, res);
});

router.post("/finish", auth(["client", "admin"]), async (req, res) => {
    handleFinishJob(req, res);
});

// worker
router.post("/apply", auth(["worker", "admin"]), async (req, res) => {
    handleApplyToWork(req, res);
});

router.post("/leave", auth(["worker", "admin"]), async (req, res) => {
    handleLeavingJob(req, res);
});

// admin 
router.get("/category", auth(["admin"]), async (req, res) => {
    handleCategoryGetter(req, res);
});

router.post("/category", auth(["admin"]), async (req, res) => {
    handleCategorySetter(req, res);
});

module.exports = router;
