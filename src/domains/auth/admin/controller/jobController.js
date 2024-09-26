import { Job, JobCategory } from "../../jobs/model.js";
import { handleError } from "../../../../util/errorHandler.js";

const verifyJobExists = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) handleError("Job not found", 404);
  return job;
};

export const getAllJobs = async () => {
  const jobs = await Job.find().populate("userId", "username");
  if (!jobs.length) handleError("No jobs found", 404);
  return jobs;
};

export const getJobById = async (jobId) => {
  const job = await verifyJobExists(jobId);
  return job.populate("userId", "username");
};

export const createJob = async (jobData) => {
  const newJob = new Job(jobData);
  return newJob.save();
};

export const updateJob = async (jobId, jobData) => {
  const job = await verifyJobExists(jobId);
  const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, { new: true });
  return updatedJob;
};

export const deleteJob = async (jobId) => {
  const job = await verifyJobExists(jobId);
  const deletedJob = await Job.findByIdAndUpdate(jobId, { unlisted: true }, { new: true });
  return deletedJob;
};

export const filterJobs = async (filter) => {
  const query = {};
  if (filter.category) query.category = filter.category;
  if (filter.publisher) query.publisher = filter.publisher;
  if (filter.finished !== undefined) query.finished = filter.finished;

  const jobs = await Job.find(query).populate("userId", "username");
  if (!jobs.length) handleError("No jobs found for the given filter", 404);
  return jobs;
};

export const getJobCategories = async () => {
  const categories = await JobCategory.find();
  return categories;
};

export const createJobCategory = async (data) => {
  const { category } = data;

  if (Array.isArray(category)) {
    const existingCategories = await JobCategory.find({ category: { $in: category } });
    const existingCategoryNames = existingCategories.map(c => c.category);

    const categoriesToCreate = category
      .filter(c => c && !existingCategoryNames.includes(c))
      .map(c => new JobCategory({ category: c }));

    if (categoriesToCreate.length > 0) {
      const savedCategories = await JobCategory.insertMany(categoriesToCreate);
      return savedCategories;
    } else {
      return [];
    }

  } else {
    const existingCategory = await JobCategory.findOne({ category });

    if (!existingCategory) {
      const newCategory = new JobCategory({ category });
      return await newCategory.save();
    } else {
      return existingCategory;
    }
  }
};

export const deleteJobCategory = async (categoryId) => {
  const category = await JobCategory.findById(categoryId);
  if (!category) handleError("Category not found", 404);
  await JobCategory.findByIdAndDelete(categoryId);
};
