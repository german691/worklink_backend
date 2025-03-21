import { _decrypt, _encrypt } from "../../../util/cryptData.js";
import { handleErrorResponse } from "../../../util/errorHandler.js";
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

// Filtros: username, open, in progress, finished
export const handleGetJob = async (req, res) => {
  try {
    await getJobSchema.validateAsync(req.query);
    const { offset = 0, limit = 10, username } = req.query;
    
    const jobs = await getJobs({
      offset: parseInt(offset, 10), 
      limit: parseInt(limit, 10), 
      username
    });

    res.status(200).json(jobs);
    
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetJobDetails = async (req, res) => {
  try {
    await findJobSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const { username } = req.body || null;

    if (!jobId) {
      return res.status(400).json({ status: 400, message: "JobId not provided" });
    }

    const decryptedJobId = _decrypt(jobId);
    const job = await getJobDetails({ jobId: decryptedJobId, username });
    if (!job) {
      return res.status(404).json({ status: 404, message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetJobApplicants = async (req, res) => {
  try {
    await findJobSchema.validateAsync(req.params);
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ status: 400, message: "Job ID not provided" });
    }

    const job = await getJobDetails(jobId);
    if (!job) {
      return res.status(404).json({ status: 404, message: "Job not found" });
    }

    const jobApplicantIds = job.applicantsId.map(id => _encrypt(id.toString()));
    res.status(200).json({ jobApplicantIds });
  } catch (error) {
    return handleErrorResponse(res, error);
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
      category,
    });

    res.status(201).json({ id: _encrypt(createdNewJob._id.toString()) });
  } catch (error) {
    return handleErrorResponse(res, error);
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
    return handleErrorResponse(res, error);
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
    return handleErrorResponse(res, error);
  }
};

export const handleApplyToJob = async (req, res) => {
  try {
    await applyToWorkSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const userId = req.currentUser.userId;

    await applyToJob({ jobId, userId });
    res.status(200).send();
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleLeaveJob = async (req, res) => {
  try {
    await leaveJobSchema.validateAsync(req.params);
    const { jobId } = req.params;
    const userId = req.currentUser.userId;

    await leaveJob({ jobId, userId });
    res.status(200).send();
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleSetFinalWorker = async (req, res) => {
  try {
    await startJobSchema.validateAsync({ ...req.params, ...req.body });
    const { jobId } = req.params;
    const { userId } = req.body;

    await setFinalWorker({ userId, jobId, currentUserId: req.currentUser.userId });

    res.status(200).send();
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleMarkJobAsCompleted = async (req, res) => {
  try {
    await finishJobSchema.validateAsync(req.params);
    const { jobId } = req.params;

    await markJobAsCompleted({ jobId, currentUserId: req.currentUser.userId });
    res.status(200).send();
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
