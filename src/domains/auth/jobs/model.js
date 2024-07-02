const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --------- Trabajo

const jobSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' } , // Qué usuario hizo la publicación
    publisher: { type: String, required: true },
    title: { type: String, required: true},
    description: { type: String, required: true},
    category: { type: String, required: true },
    //imageURLs: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: 2592000000 }, 
    applicantsId: [{ type: Schema.Types.ObjectId, ref: 'User' }], // El array con las IDs de los usuarios que se postularon
    finalApplicant: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    finished: { type: Boolean, default: false }
});

const Job = mongoose.model("job", jobSchema);

// modelo de categorías *para simplificar todo al máximo
const jobCategorySchema = new Schema({
    category: { type: String, required: true }
});

const JobCategory = mongoose.model("job_category", jobCategorySchema);

module.exports = { Job, JobCategory };