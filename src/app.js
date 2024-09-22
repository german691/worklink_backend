import connectToDB from "./config/db.js";
connectToDB();

import express from "express";

const bodyParser = express.json;

import cors from 'cors';

import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(bodyParser());

// import activityLogger from "./middleware/logs/activityLogger.js";
// app.use(activityLogger);

app.use("/api", routes);

import { initAdmin } from "./util/initAdmin.js";
initAdmin();

export default app;

