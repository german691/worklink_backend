const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --------- Trabajo

const jobSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' } , // Qué usuario hizo la publicación
    title: { type: String, required: true},
    body: { type: String, required: true},
    //imageURLs: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: 2592000000 }, 
    applicantsId: [{ type: Schema.Types.ObjectId, ref: 'User' }], // El array con las IDs de los usuarios que se postularon
    finalApplicant: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    finished: { type: Boolean, default: false }
});

const Job = mongoose.model("job", jobSchema);

// --------- Generador de índices por solicitud

const jobIndexSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
    index: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Opcional: establece un tiempo de vida para el índice temporal
});

const JobIndex = mongoose.model('JobIndex', jobIndexSchema);

module.exports = JOb, JobIndex;
