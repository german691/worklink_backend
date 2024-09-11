import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// --------- Trabajo

const jobSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Qué usuario hizo la publicación
    publisher: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    // imageURLs: [String], // Probablemente usemos URLs de imágenes, posiblemente hosteadas en local
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 2592000000) }, // 30 días por defecto
    applicantsId: [{ type: Schema.Types.ObjectId, ref: 'User' }], // IDs de los usuarios que se postularon
    finalApplicant: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    finished: { type: Boolean, default: false },
    unlisted: { type: Boolean, default: false },
    unlistedAt: { type: Date, default: null }
});

jobSchema.index({ userId: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ unlisted: 1 });

const Job = mongoose.model("Job", jobSchema);

// modelo de categorías *para simplificar todo al máximo
const jobCategorySchema = new Schema({
    category: { type: String, required: true }
});

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);

export { Job, JobCategory };