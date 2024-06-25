const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' } , // Qué usuario hizo la publicación
    title: { type: String, required: true},
    body: { type: String, required: true},
    //imageURLs: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: 2592000000 }, 
    applicantsId: [{ type: Schema.Types.ObjectId, ref: 'User' }], // El array con las IDs de los usuarios que se postularon
    finalApplicant: { type: Schema.Types.ObjectId, ref: 'User', default: undefined }
});

const Job = mongoose.model("job", jobSchema);

module.exports = Job;