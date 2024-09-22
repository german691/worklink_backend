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
    res.status(400).json({ error: error.message });
  }
};

export const handleGetJobById = async (req, res) => {
  try {
    const job = await getJobById(req.params.jobId);
    if (!job) return res.status(404).send("Job not found");
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleCreateJob = async (req, res) => {
  try {
    const newJob = await createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleUpdateJob = async (req, res) => {
  try {
    const updatedJob = await updateJob(req.params.jobId, req.body);
    if (!updatedJob) return res.status(404).send("Job not found");
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleDeleteJob = async (req, res) => {
  try {
    const deletedJob = await deleteJob(req.params.jobId);
    if (!deletedJob) return res.status(404).send("Job not found");
    res.status(200).send("Job deleted successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleFilterJobs = async (req, res) => {
  try {
    const filteredJobs = await filterJobs(req.body);
    res.status(200).json(filteredJobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleGetJobCategories = async (req, res) => {
  try {
    const category = await getJobCategories();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      throw new Error('Field "category" must be of type string or an array of strings.');
    }

    const createdCategories = await createJobCategory({ category });

    res.status(201).json(createdCategories);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleDeleteJobCategory = async (req, res) => {
  try {
    await deleteJobCategory(req.params.categoryId);
    res.status(200).send("Category deleted successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

