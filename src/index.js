const app = require("./app");
const { PORT } = process.env;

const startApp = () => {
    app.listen(PORT, () => {
        console.log(`Worklink backend running on port ${PORT}`)
    });
};

startApp();