const express = require("express");
const router = express.Router();
const { sendNewJob, getJobs } = require("./controller");
const auth = require("./../../../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;

        const jobs  = await getJobs({ page, limit, userId });
        
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/publish", auth, async (req, res) => {
    try {
        const { title, body } = req.body;
        const userId = req.currentUser.userId;  
        const userType = req.currentUser.userType;

        if (!userId) {
            throw Error("userId was not found at req.currentUser");
        }

        if (userType === "worker") {
            throw Error("Only client type user can publish job requests, not workers");
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

// router.post("/apply_to_job", auth, async (req, res) => {
//     try {
//         const { jobId } = req.body;
//         const userId = req.currentUser.userId;  

//         if (!userId) {
//             throw Error("userId was not found at req.currentUser");
//         }

//         res.status(200).json(appliedJob);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

module.exports = router;
