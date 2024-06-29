const express = require("express");
const router = express.Router();
const { sendNewJob, getJobs, dropJob, editJob } = require("./controller");
const auth = require("./../../../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, username } = req.query;
        const jobs = await getJobs({ page, limit, username });
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

        console.log(`${userType} ${userId}`)

        if (!userId) {
            throw Error("userId was not found at req.currentUser");
        }

        if (userType !== "client") {
            throw Error(`Only client type user can publish job requests, not ${userType}`);
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

router.delete("/delete", auth, async (req, res) => {
    try {
        const { jobId } = req.query; // La idea es recibir un jobId hasheado y verificar su integridad acá
        const userId = req.currentUser.userId;  

        if (!jobId) {
            throw Error("jobId must be provided in order to delete a job");
        }

        const deletedJob = await dropJob({
            userId,
            jobId,
        });

        res.status(200).json(deletedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/edit", auth, async (req, res) => {
    try {
        const { jobId } = req.query;
        const { title, body } = req.body;

        const userId = req.currentUser.userId;
        
        if (!jobId) {
            throw Error("jobId must be provided in order to edit a job");
        }

        if (!(title && body)) {
            throw Error("title and body empty, at least one must be provided");
        }

        const editedJob = await editJob({
            userId, 
            jobId,
            title, 
            body
        });

        res.status(200).json(editedJob);
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
