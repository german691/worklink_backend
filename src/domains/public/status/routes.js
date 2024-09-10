import express from 'express';
const router = express.Router();
import checkStatus from "./handler.js";

router.get("/", async (req, res) => {
    checkStatus();
});

export default router;
