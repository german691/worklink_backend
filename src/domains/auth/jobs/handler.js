import { _encrypt } from "../../../util/cryptData.js";
import {
  applyToWorkSchema,
  categorySetterSchema,
  findJobSchema,
  dropJobSchema,
  editJobSchema,
  finishJobSchema,
  getJobSchema,
  leaveJobSchema,
  postJobSchema,
  startJobSchema,
} from "../../../validation/jobSchemes.js";

import {
  sendNewJob,
  getJobs,
  getJobDetails,
  dropJob,
  editJob,
  getCategories,
  applyToJob,
  leaveJob,
  setFinalWorker,
  markJobAsCompleted,
} from "./controller.js";

export const handleGetJob = async (req, res) => {
  try {
    await getJobSchema.validateAsync(req.query);
    const { page = 1, limit = 10, username } = req.query;
    const jobs = await getJobs({ page, limit, username });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleGetJobDetails = async (req, res) => {
  try {
    await findJobSchema.validateAsync(req.params);
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID not provided" });
    }

    const job = await getJobDetails(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", "error": error });
  }
};

export const handleGetJobApplicants = async (req, res) => {
  try {
    await findJobSchema.validateAsync(req.params);
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID not provided" });
    }

    const job = await getJobDetails(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const jobApplicantIds = job.applicantsId.map(id => _encrypt(id.toString()));
    res.status(200).json({ jobApplicantIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handlePostJob = async (req, res) => {
  try {
    await postJobSchema.validateAsync(req.body);
    const { title, description, category } = req.body;
    const userId = req.currentUser.userId;
    const username = req.currentUser.username;

    const createdNewJob = await sendNewJob({
      publisher: username,
      userId,
      title,
      description,
      category
    });

    res.status(201).json({ id: _encrypt(createdNewJob._id.toString()) });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleDropJob = async (req, res) => {
  try {
    await dropJobSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const userId = req.currentUser.userId;

    const droppedJob = await dropJob({ jobId, userId });
    res.status(200).json(droppedJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleEditJob = async (req, res) => {
  try {
    await editJobSchema.validateAsync({ ...req.params, ...req.body });
    const { jobId } = req.params;
    const { title, description } = req.body;
    const userId = req.currentUser.userId;

    const editedJob = await editJob({ jobId, userId, title, description });
    res.status(200).json(editedJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleApplyToJob = async (req, res) => {
  try {
    await applyToWorkSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const userId = req.currentUser.userId;

    const appliedJob = await applyToJob({ jobId, userId });
    res.status(200).json(appliedJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleLeaveJob = async (req, res) => {
  try {
    await leaveJobSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const userId = req.currentUser.userId;

    const leftJob = await leaveJob({ jobId, userId });
    res.status(200).json(leftJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleSetFinalWorker = async (req, res) => {
  try {
    await startJobSchema.validateAsync({ ...req.params, ...req.body });
    const { jobId } = req.params;
    const { userId } = req.body;

    const updatedJob = await setFinalWorker({ userId, jobId, currentUserId: req.currentUser.userId });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleMarkJobAsCompleted = async (req, res) => {
  try {
    await finishJobSchema.validateAsync(req.params);
    const { jobId } = req.params;

    const completedJob = await markJobAsCompleted({ jobId, currentUserId: req.currentUser.userId });
    res.status(200).json(completedJob);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const handleGetCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
