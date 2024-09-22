import { Job, JobCategory } from "../../jobs/model.js";

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

export const deleteJobCategory = async (categoryId) => JobCategory.findByIdAndDelete(categoryId);
