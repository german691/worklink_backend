import { Job, JobCategory } from './model.js';
import User from './../user/model.js';
import { _encrypt, _decrypt } from "./../../../util/cryptData.js";
import mongoose from 'mongoose';

const sendNewJob = async (data) => {
  const { publisher, userId, title, description, category } = data;
  const fetchedCategory = await JobCategory.findOne({ category });
  if (!fetchedCategory) throw Error(`${category} not in category list`);

  const fetchedUser = await User.findById(userId);
  if (!fetchedUser) throw Error("Invalid user");

  const newJob = new Job({
    userId, title, description, publisher, category,
    createdAt: Date.now(),
    expiresAt: Date.now() + 2592000000,
  });

  return await newJob.save();
};

const getJobs = async (data) => {
  const { offset = 0, limit = 10, username } = data;
  let user = null;
  if (username) {
    user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
  }

  const query = user ? { userId: user._id } : {};
  const totalJobs = await Job.countDocuments(query);
  const jobs = await Job.find(query).skip(offset).limit(limit);

  if (!jobs.length) throw new Error("No jobs found");

  return {
    jobs: jobs.map(job => ({
      id: _encrypt(job._id.toString()),
      title: job.title,
      description: job.description,
      publisher: job.publisher
    })),
    totalJobs
  };
};

const getJobDetails = async (data) => {
  if (!data) return null;
  const decryptedJobId = _decrypt(data);
  return await Job.findById(decryptedJobId);
};

const dropJob = async (data) => {
  const { userId, jobId } = data;
  if (!(userId && jobId)) throw Error("userId and jobId required");

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (!fetchedJob) throw Error("Job not found");

  if (fetchedJob.finished) throw Error("Cannot delete finished job");
  if (fetchedJob.finalApplicant) throw Error("Cannot delete job with final worker");
  if (!fetchedJob.userId.equals(userId)) throw Error("Unauthorized access");

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { unlisted: true, unlistedAt: new Date() }
  }, { new: true });
};

const editJob = async (data) => {
  const { userId, jobId, title, description } = data;
  if (!(userId && jobId)) throw Error("userId and jobId required");

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (!fetchedJob) throw Error("Job not found");
  if (!fetchedJob.userId.equals(userId)) throw Error("Unauthorized access");
  if (fetchedJob.finished) throw Error("Cannot edit finished job");

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { title, description }
  }, { new: true });
};

const setFinalWorker = async (data) => {
  const { userId, jobId, currentUserId } = data;
  const decryptedUserId = _decrypt(userId);
  const fetchedWorker = await User.findById(decryptedUserId);
  if (!fetchedWorker) throw Error("User not found");
  if (fetchedWorker.userType !== "worker") throw Error("User must be a worker");

  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (!fetchedJob) throw Error("Job not found");
  if (!fetchedJob.userId.equals(currentUserId)) throw Error("Unauthorized access");

  const isApplicant = await Job.findOne({
    _id: decryptedJobId,
    applicantsId: new mongoose.Types.ObjectId(decryptedUserId)
  });
  if (!isApplicant) throw Error("Worker has not applied to job");

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { finalApplicant: new mongoose.Types.ObjectId(decryptedUserId), applicantsId: [] }
  }, { new: true });
};

const markJobAsCompleted = async (data) => {
  const { jobId, currentUserId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (!fetchedJob) throw Error("Job not found");
  if (!fetchedJob.finalApplicant) throw Error("Job does not have a final worker");
  if (!fetchedJob.userId.equals(currentUserId)) throw Error("Unauthorized access");

  return await Job.findByIdAndUpdate(decryptedJobId, {
    $set: { finished: true }
  }, { new: true });
};

const applyToJob = async (data) => {
  const { userId, jobId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (fetchedJob.finalApplicant) throw Error("Cannot apply to started job");
  if (fetchedJob.applicantsId.includes(userId)) throw Error("Already in applicants list");

  fetchedJob.applicantsId.push(userId);
  return await fetchedJob.save();
};

const leaveJob = async (data) => {
  const { userId, jobId } = data;
  const decryptedJobId = _decrypt(jobId);
  const fetchedJob = await Job.findById(decryptedJobId);
  if (fetchedJob.finalApplicant === userId) throw Error("Cannot leave job where already accepted");

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
