import { Job, JobCategory } from './model.js';
import User from './../user/model.js';
import { _encrypt, _decrypt } from "./../../../util/cryptData.js";
import mongoose from 'mongoose';

// client --------------------------------------------------------------
const sendNewJob = async (data) => {
  try {
    const { publisher, userId, title, description, category } = data;

    const fetchedCategory = await JobCategory.findOne({ category });
    if (!fetchedCategory) throw Error(`${category} no está en la lista de categorías`);

    const fetchedUser = await User.findById(userId);
    if (!fetchedUser) throw Error("El usuario no es válido");

    const newJob = new Job({
      userId, title, description, publisher, category,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2592000000,
    });

    const createdJob = await newJob.save();
    return createdJob;
  } catch (error) {
    throw error;
  }
};

const getJobs = async (data) => {
  try {
    const { offset = 0, limit = 10, username } = data;

    let user = null;
    if (username) {
      user = await User.findOne({ username });
      if (!user) throw new Error("Usuario no encontrado");
    }

    const query = user ? { userId: user._id } : {};
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query).skip(offset).limit(limit);

    if (!jobs.length) throw new Error("No se encontraron trabajos");

    const encryptedJobs = jobs.map(job => ({
      id: _encrypt(job._id.toString()),
      title: job.title,
      description: job.description,
      publisher: job.publisher
    }));

    return { jobs: encryptedJobs, totalJobs };
  } catch (error) {
    throw error;
  }
};

const getJobDetails = async (jobId) => {  
  if (!jobId) {
    return null;
  }

  const decryptedJobId = _decrypt(jobId);
  const job = await Job.findById(decryptedJobId);

  return job;
};

const dropJob = async (data) => {
  try {
    const { userId, jobId } = data;

    if (!(userId && jobId)) throw Error("Se requiere userId y jobId");

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (!fetchedJob) throw Error("Trabajo no encontrado");

    if (fetchedJob.finished) throw Error("No se puede eliminar un trabajo ya finalizado");

    if (fetchedJob.finalApplicant) throw Error("No se puede eliminar un trabajo con un trabajador definitivo");

    if (!fetchedJob.userId.equals(userId)) throw Error("Acceso no autorizado");

    const droppedJob = await Job.findByIdAndUpdate(decryptedJobId, {
      $set: { unlisted: true, unlistedAt: new Date() }
    }, { new: true });

    return droppedJob;
  } catch (error) {
    throw error;
  }
};

const editJob = async (data) => {
  try {
    const { userId, jobId, title, description } = data;

    if (!(userId && jobId)) throw Error("Se requiere userId y jobId");

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (!fetchedJob) throw Error("Trabajo no encontrado");

    if (!fetchedJob.userId.equals(userId)) throw Error("Acceso no autorizado");

    if (fetchedJob.finished) throw Error("No se puede editar un trabajo ya finalizado");

    const updatedJob = await Job.findByIdAndUpdate(decryptedJobId, {
      $set: { title, description }
    }, { new: true });

    return updatedJob;
  } catch (error) {
    throw error;
  }
};

const setFinalWorker = async (data) => {
  try {
    const { userId, jobId, currentUserId } = data;

    const decryptedUserId = _decrypt(userId);
    const fetchedWorker = await User.findById(decryptedUserId);
    if (!fetchedWorker) throw Error("Usuario no encontrado");

    console.log(fetchedWorker);
    if (fetchedWorker.userType !== "worker") throw Error("El usuario debe ser trabajador");

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (!fetchedJob) throw Error("Trabajo no encontrado");

    if (!fetchedJob.userId.equals(currentUserId)) throw Error("Acceso no autorizado");

    const isApplicant = await Job.findOne({
      _id: decryptedJobId,
      applicantsId: new mongoose.Types.ObjectId(decryptedUserId)
    });
    if (!isApplicant) throw Error("El trabajador no ha aplicado al trabajo");

    const finalWorker = await Job.findByIdAndUpdate(decryptedJobId, {
      $set: { finalApplicant: new mongoose.Types.ObjectId(decryptedUserId), applicantsId: [] }
    }, { new: true });

    return finalWorker;
  } catch (error) {
    throw error;
  }
};


const markJobAsCompleted = async (data) => {
  try {
    const { jobId, currentUserId } = data;

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (!fetchedJob) throw Error("Trabajo no encontrado");

    if (!fetchedJob.finalApplicant) throw Error("El trabajo no tiene un trabajador final");

    if (!fetchedJob.userId.equals(currentUserId)) throw Error("Acceso no autorizado");

    const completedJob = await Job.findByIdAndUpdate(decryptedJobId, {
      $set: { finished: true }
    }, { new: true });

    return completedJob;
  } catch (error) {
    throw error;
  }
};

// worker --------------------------------------------------------------
const applyToJob = async (data) => {
  try {
    const { userId, jobId } = data;

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (fetchedJob.finalApplicant) throw Error("No se puede aplicar a un trabajo ya iniciado");

    if (fetchedJob.applicantsId.includes(userId)) throw Error("Ya está en la lista de solicitantes");

    fetchedJob.applicantsId.push(userId);
    const updatedJob = await fetchedJob.save();

    return updatedJob;
  } catch (error) {
    throw error;
  }
};

const leaveJob = async (data) => {
  try {
    const { userId, jobId } = data;

    const decryptedJobId = _decrypt(jobId);
    const fetchedJob = await Job.findById(decryptedJobId);
    if (fetchedJob.finalApplicant === userId) throw Error("No se puede abandonar un trabajo en el que ya fue aceptado");

    fetchedJob.applicantsId = fetchedJob.applicantsId.filter(id => id.toString() !== userId);
    const updatedJob = await fetchedJob.save();

    return updatedJob;
  } catch (error) {
    throw error;
  }
};

// admin --------------------------------------------------------------
const createNewCategory = async (data) => {
  try {
    const { category } = data;

    const newCategory = new JobCategory({ category });
    const createdCategory = await newCategory.save();

    return createdCategory;
  } catch (error) {
    throw error;
  }
};

const getCategories = async () => {
  try {
    const categories = await JobCategory.find();
    return categories;
  } catch (error) {
    throw error;
  }
};

export {
  sendNewJob,
  getJobs,
  getJobDetails,
  dropJob,
  editJob,
  setFinalWorker,
  markJobAsCompleted,
  applyToJob,
  leaveJob,
  createNewCategory,
  getCategories
};
