import connectToDB from "./config/db.js";
connectToDB();

import express from "express";

const bodyParser = express.json;

import cors from 'cors';

import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(bodyParser());

app.use("/api", activityLogger, routes);
app.use(endpointNotFound);

import { initAdmin } from "./util/initAdmin.js";
initAdmin();

import { initSuperadmin } from "./util/initSuperadmin.js";
import activityLogger from "./middleware/logs/activityLogger.js";
import { endpointNotFound } from "./domains/public/status/handler.js";

initSuperadmin();

export default app;

