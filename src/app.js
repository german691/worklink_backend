//mongodb connection
import connectToDB from "./config/db.js";
connectToDB();

import express from "express";

const bodyParser = express.json;

import cors from 'cors';

import routes from './routes/index.js'

const app = express();

app.use(cors());
app.use(bodyParser());

app.use("/api/v1", routes);

import { initAdmin } from "./util/initAdmin.js";
initAdmin()

export default app;

