import { Job } from "../../jobs/model.js";

export const getAllJobs = async () => Job.find().populate("userId", "username");

export const getJobById = async (jobId) => Job.findById(jobId).populate("userId", "username");

export const createJob = async (jobData) => {
  const newJob = new Job(jobData);
  return newJob.save();
};

export const updateJob = async (jobId, jobData) => Job.findByIdAndUpdate(jobId, jobData, { new: true });

export const deleteJob = async (jobId) => Job.findByIdAndUpdate(jobId, { unlisted: true }, { new: true });

export const filterJobs = async (filter) => {
  const query = {};
  if (filter.category) query.category = filter.category;
  if (filter.publisher) query.publisher = filter.publisher;
  if (filter.finished !== undefined) query.finished = filter.finished;
  return Job.find(query).populate("userId", "username");
};

export const getJobCategories = async () => JobCategory.find();

export const createJobCategory = async (categoryData) => {
  const newCategory = new JobCategory(categoryData);
  return newCategory.save();
};

export const deleteJobCategory = async (categoryId) => JobCategory.findByIdAndDelete(categoryId);
