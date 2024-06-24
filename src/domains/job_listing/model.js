const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobListingSchema = new Schema({
    publisherID: String, // Qué usuario hizo la publicación
    title: String,
    body: String,
    images: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: 2592000000 }, 
    applicantsID: [{ type: Schema.Types.ObjectId, ref: 'User' }] // El array con las IDs de los usuarios que se postularon
});

const jobListing = mongoose.model("job_listing", jobListingSchema);

module.exports = jobListing;