const express = require("express");
const router = express.Router();
const { sendNewJobListing } = require("./controller");
const auth = require("./../../middleware/auth");

router.post("/add", auth, (req, res) => {
    try {
        const { publisherID, title, body } = req.body;
        const createdNewJobListing = sendNewJobListing({
            publisherID, 
            title, 
            body
        });
        res.status(200).json(createdNewJobListing);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;