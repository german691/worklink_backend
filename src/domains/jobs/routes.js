const express = require("express");
const router = express.Router();
const { sendNewJob, getUserRelatedJobs, getAllJobs } = require("./controller");
const auth = require("../../middleware/auth");

// no implementado
router.get("/alljobs", auth, async (req, res) => {
    try {
        const jobListing = await getAllJobs();
        res.status(200).json(jobListing);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// no implementado
router.get("/myjobs", auth, async (req, res) => {
    try {
        const userId = req.currentUser._id; 
        
        const userJobs = getUserRelatedJobs({ userId });

        res.status(200).json(userJobs);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/publish", auth, async (req, res) => {
    try {
        const { title, body } = req.body;
        const userId = req.currentUser.userId;  

        if (!userId) {
            throw Error("userId was not found at req.currentUser");
        }

        const createdNewJob = await sendNewJob({
            userId, 
            title, 
            body
        });

        res.status(200).json(createdNewJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// no implementado
router.post("/apply_to_job", auth, async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.currentUser.userId;  

        if (!userId) {
            throw Error("userId was not found at req.currentUser");
        }

        res.status(200).json(appliedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
