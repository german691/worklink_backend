const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobListingSchema = new Schema({
    user_publiser: String, // Qué usuario hizo la publicación
    title: String,
    body: String,
    images: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, 
        default: function() {
            const oneMonth = 2592000000 //30 * 24 * 60 * 60 * 1000 = 2592000000 un mes en milisegundos
            return new Date(this.createdAt.getTime() + oneMonth);
        }
    },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }] // El array con las IDs de los usuarios que se postularon
});

const jobListing = mongoose.model("job_listing", jobListingSchema);

module.exports = jobListing;