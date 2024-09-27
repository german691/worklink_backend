import express from 'express';
const router = express.Router();
import { checkStatus } from "./handler.js";

router.get("/", checkStatus);

export default router;
