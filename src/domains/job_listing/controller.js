const jobListing = require('./model');

const sendNewJobListing = async (data) => {
    try {
        const { publisherID, title, body, images } = data;

        if (!(publisherID, title, body)) {
            throw Error("publisherID, title, body & createdAt must be declared")
        }

        const newJobListing = await new jobListing({
            publisherID,
            title,
            body,
            images,
            createdAt: Date.now(),
            expiresAt: Date.now() + 2592000000, //30 * 24 * 60 * 60 * 1000 = 2592000000 un mes en milisegundos
        });
        const createdNewJobListing = await newJobListing.save();

        return createdNewJobListing;
    } catch (error) {
        throw error;
    }
}

module.exports = { sendNewJobListing };