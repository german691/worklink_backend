import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
const { PORT } = process.env;

const startApp = () => {
    app.listen(PORT, () => {
        console.log(`Worklink backend running on port ${PORT}`)
    });
};

startApp();