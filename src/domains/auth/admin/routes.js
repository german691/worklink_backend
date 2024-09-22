import express from 'express';
const router = express.Router();
import auth from "./../../../middleware/auth.js";

import {
    handleAdminLogin,
    handleAdminRegister,
    handleUpdateAdminInfo,
    handleResetAdminPassword,
    handleGetAdminList,
    handleDeleteAdmin,
} from './handler/adminHandler.js';

import {
    handleGetAllJobs,
    handleGetJobById,
    handleCreateJob,
    handleUpdateJob,
    handleDeleteJob,
    handleFilterJobs,
    handleGetJobCategories,
    handleCreateJobCategory,
    handleDeleteJobCategory,
} from './handler/jobHandler.js';

import {
    handleGetLogs,
    handleGetLogById,
    handleDeleteLog,
    handleFilterLogs,
    handleExportLogs,
    handleSearchLogs,
} from './handler/logsHandler.js';

import {
    handleGetUsersInfo,
    handleGetUserById,
    handleUpdateUserRole,
    handleCreateNewUser,
    handleUpdateUserInfo,
    handleDeactivateUser,
    handleReactivateUser,
    handleGetUserActivityLogs,
    handleGenerateUserReport,
    handleExportUserList,
    handleUserPasswordReset
} from './handler/userHandler.js';

// Admin management
router.post("/auth", handleAdminLogin);
router.post("/register", auth(["superadmin"]), handleAdminRegister);
router.get("/user_info", auth(["admin"]), handleGetUsersInfo);
router.get("/users/:userId", auth(["admin"]), handleGetUserById);
router.put("/users/:userId/role", auth(["admin"]), handleUpdateUserRole);
router.put("/users/:userId", auth(["admin"]), handleUpdateUserInfo);
router.post("/users", auth(["admin"]), handleCreateNewUser);
router.delete("/users/:userId", auth(["admin"]), handleDeactivateUser);
router.put("/users/:userId/reactivate", auth(["admin"]), handleReactivateUser);
router.put("/users/:userId/reset_password", auth(["admin"]), handleUserPasswordReset);

// Admin account management
router.get("/admins", auth(["admin"]), handleGetAdminList);
router.delete("/admins/:adminId", auth(["superadmin"]), handleDeleteAdmin);
router.put("/admins/:adminId", auth(["admin"]), handleUpdateAdminInfo);
router.get("/admin/:adminId", auth(["admin"]), handleResetAdminPassword);


// Logs management
router.get("/logs", auth(["admin"]), handleGetLogs);
router.get("/logs/:logId", auth(["admin"]), handleGetLogById);
router.delete("/logs/:logId", auth(["superadmin"]), handleDeleteLog);
router.post("/logs/filter", auth(["admin"]), handleFilterLogs);
router.get("/logs/export", auth(["superadmin"]), handleExportLogs);
router.post("/logs/search", auth(["admin"]), handleSearchLogs);

// Job management
router.get("/jobs", auth(["admin"]), handleGetAllJobs);
router.get("/jobs/:jobId", auth(["admin"]), handleGetJobById);
router.post("/jobs", auth(["admin"]), handleCreateJob);
router.put("/jobs/:jobId", auth(["admin"]), handleUpdateJob);
router.delete("/jobs/:jobId", auth(["admin"]), handleDeleteJob);
router.post("/jobs/filter", auth(["admin"]), handleFilterJobs);
router.get("/jobs/categories", auth(["admin"]), handleGetJobCategories);
router.post("/jobs/categories", auth(["admin"]), handleCreateJobCategory);
router.delete("/jobs/categories/:categoryId", auth(["admin"]), handleDeleteJobCategory);

// User activity management
router.get("/users/:userId/activity", auth(["admin"]), handleGetUserActivityLogs);
router.post("/users/report", auth(["admin"]), handleGenerateUserReport);
router.get("/users/export", auth(["admin"]), handleExportUserList);

export default router;
