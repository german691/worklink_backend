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

const handleErrorResponse = (res, error) => res.status(error.status || 400).json({ error: error.message });

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
    const categories = await getJobCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleCreateJobCategory = async (req, res) => {
  try {
    const newCategory = await createJobCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
