import { handleErrorResponse } from "../../../../util/errorHandler.js";
import {
  getUsersInfo,
  getUserById,
  updateUserRole,
  createNewUser,
  updateUserInfo,
  deactivateUser,
  reactivateUser,
  getUserActivityLogs,
  generateUserReport,
  exportUserList
} from "../controller/userController.js";

export const handleGetUsersInfo = async (req, res) => {
  try {
    const users = await getUsersInfo();
    res.status(200).json(users);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) return handleError("User not found", 404);;
    res.status(200).json(user);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleUpdateUserRole = async (req, res) => {
  try {
    const updatedUser = await updateUserRole(req.params.userId, req.body.newRole);
    if (!updatedUser) return handleError("User not found", 404);
    res.status(200).json(updatedUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleCreateNewUser = async (req, res) => {
  try {
    const newUser = await createNewUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleUpdateUserInfo = async (req, res) => {
  try {
    const updatedUser = await updateUserInfo(req.params.userId, req.body);
    if (!updatedUser) return handleError("User not found", 404);
    res.status(200).json(updatedUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleDeactivateUser = async (req, res) => {
  try {
    const updatedUser = await deactivateUser(req.params.userId);
    if (!updatedUser) return handleError("User not found", 404);
    res.status(200).json(updatedUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleReactivateUser = async (req, res) => {
  try {
    const updatedUser = await reactivateUser(req.params.userId);
    if (!updatedUser) return handleError("User not found", 404);
    res.status(200).json(updatedUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleUserPasswordReset = async (req, res) => {
  try {
    const updatedUser = await forcePasswordReset(req.params.userId, req.body.newPassword);
    if (!updatedUser) return handleError("User not found", 404);
    res.status(200).json(updatedUser);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetUserActivityLogs = async (req, res) => {
  try {
    const logs = await getUserActivityLogs(req.params.userId);
    res.status(200).json(logs);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGenerateUserReport = async (req, res) => {
  try {
    const report = await generateUserReport(req.body);
    res.status(200).json(report);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleExportUserList = async (req, res) => {
  try {
    const csv = await exportUserList();
    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
