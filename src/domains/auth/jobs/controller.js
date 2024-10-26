import { Job, JobCategory } from './model.js';
import User from './../user/model.js';
import { _encrypt, _decrypt } from "./../../../util/cryptData.js";
import mongoose from 'mongoose';
import { handleError } from '../../../util/errorHandler.js';

const verifyExists = async (model, query, notFoundMessage) => {
  const result = await model.findOne(query);
  if (!result) handleError(notFoundMessage, 404);
  return result;
};

const verifyUserExists = async (userId) => verifyExists(User, { _id: userId }, "Invalid user");
const verifyJobExists = async (jobId) => verifyExists(Job, { _id: jobId }, "Job not found");
const verifyCategoryExists = async (category) => verifyExists(JobCategory, { category }, `${category} not in category list`);

const sendNewJob = async (data) => {
  const { publisher, userId, title, description, category } = data;
  
  await Promise.all([
    verifyCategoryExists(category),
    verifyUserExists(userId)
  ]);

  const newJob = new Job({
    userId, title, description, publisher, category,
    createdAt: Date.now(),
    expiresAt: Date.now() + 2592000000,
  });

  return await newJob.save();
};

const getJobs = async ({ offset = 0, limit = 10, username }) => {
  const user = username ? await verifyUserExists(username) : null;
  
  const query = user ? { userId: user._id } : {};
  const totalJobs = await Job.countDocuments(query);
  const jobs = await Job.find(query).skip(offset).limit(limit);

  if (!jobs.length) handleError("No jobs found", 404);

  const obtainUserDetails = async (applicantId) => {
    if (!applicantId) return null; 

    const user = await User.findById(applicantId);

    if (user) {
      return {
        userId: _encrypt(applicantId.toString()),
        username: user.username,
        name: user.name,
        surname: user.surname,
        birthdate: user.birthdate
      }
    }
    return null;
  } 

  const jobsWithDetails = await Promise.all(jobs.map(async job => ({
    id: _encrypt(job._id.toString()),
    title: job.title,
    category: job.category,
    description: job.description,
    publisher: job.publisher,
    publisherId: job.userId,
    createdAt: job.createdAt,
    applicants: await Promise.all(job.applicantsId.map(obtainUserDetails)), 
    finalApplicant: await obtainUserDetails(job.finalApplicant), 
    finished: job.finished,
    isUnlisted: job.unlisted
  })));

  return {
    jobs: jobsWithDetails,
    totalJobs
  };
};

const getJobDetails = async ({ jobId, username }) => {
  const user = username ? await verifyUserExists(username) : null;

  const query = user ? { _id: jobId, userId: user._id } : { _id: jobId };
  const job = await Job.findOne(query);

  if (!job) handleError("Job not found", 404);

  const obtainUserDetails = async (applicantId) => {
    if (!applicantId) return null;

    const user = await User.findById(applicantId);

    if (user) {
      return {
        userId: _encrypt(applicantId.toString()),
        username: user.username,
        name: user.name,
        surname: user.surname,
        birthdate: user.birthdate
      };
    }
    return null;
  };

  const jobWithDetails = {
    id: _encrypt(job._id.toString()),
    title: job.title,
    category: job.category,
    description: job.description,
    publisher: job.publisher,
    publisherId: job.userId,
    createdAt: job.createdAt,
    applicants: await Promise.all(job.applicantsId.map(obtainUserDetails)),
    finalApplicant: await obtainUserDetails(job.finalApplicant),
    finished: job.finished,
    isUnlisted: job.unlisted
  };

  return {
    job: jobWithDetails
  };

};

const dropJob = async (data) => {
  const { userId, jobId } = data;

  if (!userId) handleError(`userId must be provided`, 400);
  if (!jobId) handleError("jobId parameter required", 404);

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (fetchedJob.finished) handleError("Cannot delete finished job", 400);
  if (fetchedJob.finalApplicant) handleError("Cannot delete job with final worker", 400);
  if (!fetchedJob.userId.equals(userId)) handleError("Unauthorized access", 403);

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { unlisted: true, unlistedAt: new Date() }
  }, { new: true });
};

const editJob = async (data) => {
  const { userId, jobId, title, description } = data;
  if (!(userId && jobId)) handleError("userId and jobId required", 400);

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (!fetchedJob.userId.equals(userId)) handleError("Unauthorized access", 403);
  if (fetchedJob.finished) handleError("Cannot edit finished job", 400);

  return await Job.findByIdAndUpdate(decryptedJobId, { $set: { title, description } }, { new: true });
};

const setFinalWorker = async (data) => {
  const { userId, jobId, currentUserId } = data;
  const decryptedUserId = _decrypt(userId);
  
  const fetchedWorker = await verifyUserExists(decryptedUserId);
  if (fetchedWorker.userType !== "worker") handleError("User must be a worker", 400);

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (fetchedJob.finalApplicant) {
    handleError("A final worker has already been selected for this job", 400);
  }

  if (!fetchedJob.userId.equals(currentUserId)) handleError("Unauthorized access", 403);

  const isApplicant = await Job.findOne({
    _id: decryptedJobId,
    applicantsId: new mongoose.Types.ObjectId(decryptedUserId)
  });
  if (!isApplicant) handleError("Worker has not applied to job", 400);

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { finalApplicant: new mongoose.Types.ObjectId(decryptedUserId), applicantsId: [] }
  }, { new: true });
};

const markJobAsCompleted = async (data) => {
  const { jobId, currentUserId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (!fetchedJob.finalApplicant) handleError("Job does not have a final worker", 400);
  if (!fetchedJob.userId.equals(currentUserId)) handleError("Unauthorized access", 403);

  return await Job.findByIdAndUpdate(decryptedJobId, { $set: { finished: true } }, { new: true });
};

const applyToJob = async (data) => {
  const { userId, jobId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (fetchedJob.finalApplicant) handleError("Cannot apply to started job", 400);
  if (fetchedJob.applicantsId.includes(userId)) handleError("Already in applicants list", 400);

  fetchedJob.applicantsId.push(userId);
  return await fetchedJob.save();
};

const leaveJob = async (data) => {
  const { userId, jobId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await verifyJobExists(decryptedJobId);

  if (fetchedJob.finalApplicant === userId) handleError("Cannot leave job where already accepted", 400);

  fetchedJob.applicantsId = fetchedJob.applicantsId.filter(id => id.toString() !== userId);
  return await fetchedJob.save();
};

const getCategories = async () => {
  return await JobCategory.find();
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
  getCategories
};
