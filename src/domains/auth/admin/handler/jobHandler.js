import { handleError, handleErrorResponse } from "../../../../util/errorHandler.js";
import { categorySetterSchema } from "../../../../validation/jobSchemes.js";
import { 
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  filterJobs,
  getJobCategories,
  createJobCategory,
  deleteJobCategory
} from "../controller/jobController.js";

export const handleGetAllJobs = async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetJobById = async (req, res) => {
  try {
    const job = await getJobById(req.params.jobId);
    if (!job) return handleError("Job not found", 404);
    res.status(200).json(job);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleCreateJob = async (req, res) => {
  try {
    const newJob = await createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleUpdateJob = async (req, res) => {
  try {
    const updatedJob = await updateJob(req.params.jobId, req.body);
    if (!updatedJob) return handleError("Job not found", 404);
    res.status(200).json(updatedJob);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleDeleteJob = async (req, res) => {
  try {
    const deletedJob = await deleteJob(req.params.jobId);
    if (!deletedJob) return handleError("Job not found", 404);
    res.status(200).send("Job deleted successfully");
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleFilterJobs = async (req, res) => {
  try {
    const filteredJobs = await filterJobs(req.body);
    res.status(200).json(filteredJobs);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetJobCategories = async (req, res) => {
  try {
    const category = await getJobCategories();
    res.status(200).json(category);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleCreateJobCategory = async (req, res) => {
  try {
    await categorySetterSchema.validateAsync(req.body);
    let { category } = req.body;

    if (Array.isArray(category)) {
      category = category.map(c => typeof c === 'string' ? c.toLowerCase() : '');
    } else if (typeof category === 'string') {
      category = category.toLowerCase();
    } else {
      return handleError('Field "category" must be of type string or an array of strings', 400);
    }

    const createdCategories = await createJobCategory({ category });

    res.status(201).json(createdCategories);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleDeleteJobCategory = async (req, res) => {
  try {
    await deleteJobCategory(req.params.categoryId);
    res.status(200).send("Category deleted successfully");
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

