const express = require("express");
const router = express.Router();
const { sendNewJob, getJobs, dropJob, editJob, getCategories, createNewCategory, applyToJob, leaveJob, setFinalWorker, markJobAsCompleted } = require("./controller");
const auth = require("./../../../middleware/auth");

// routes for clients
// add, list, edit, delete jobs
router.post("/", auth(["client", "admin"]), async (req, res) => {
    try {
        const { title, description, category } = req.body; // falta categoría del trabajo, para futuros filtros de búsqueda
        const userId = req.currentUser.userId;  
        const username = req.currentUser.username;

        const createdNewJob = await sendNewJob({ 
            publisher: username, 
            userId, 
            title, 
            description,
            category
        });

        res.status(200).json(createdNewJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/", auth(), async (req, res) => {
    try {
        const { page = 1, limit = 10, username } = req.query;
        const jobs = await getJobs({ page, limit, username });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/", auth(["client", "admin"]), async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.currentUser.userId;  

        if (!jobId) {
            throw Error("jobId must be provided in order to delete a job");
        }

        const deletedJob = await dropJob({ userId, jobId });

        res.status(200).json(deletedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/", auth(["client", "admin"]), async (req, res) => {
    try {
        const { jobId, title, description, } = req.body;
        const userId = req.currentUser.userId;
        
        if (!jobId) {
            throw Error("jobId must be provided in order to edit a job");
        }

        if (!(title || description)) {
            throw Error("Title or description empty");
        }

        const editedJob = await editJob({
            userId, jobId, title, description
        });

        res.status(200).json(editedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/start", auth(["client", "admin"]), async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        if (!(userId && jobId)) throw Error("userId or jobId not found");

        const finalWorker = await setFinalWorker({ userId, jobId });
        
        res.status(200).json(finalWorker);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/finish", auth(["client", "admin"]), async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) throw Error("A jobId is required");

        const completedJob = await markJobAsCompleted(jobId);
        res.status(200).json(completedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// worker
router.post("/apply", auth(["worker", "admin"]), async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.currentUser.userId;
        
        if (!jobId) {
            throw Error("jobId must be provided in order to edit a job");
        }

        const appliedJob = await applyToJob({ userId, jobId });

        res.status(200).json(appliedJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/leave", auth(["worker", "admin"]), async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.currentUser.userId;
        
        if (!jobId) {
            throw Error("jobId must be provided in order to leave a job");
        }

        const leftJob = await leaveJob({ userId, jobId });

        res.status(200).json(leftJob);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// admin 
router.post("/category", auth(["admin"]), async (req, res) => {
    try {
        const { category } = req.body; // falta categoría del trabajo, para futuros filtros de búsqueda

        if (!category) throw Error("A value for category must be provided")
        const createdNewCategory = await createNewCategory({ category });

        res.status(200).json(createdNewCategory);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/category", auth(["admin"]), async (req, res) => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
