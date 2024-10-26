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


// Admin management ---------------------------------------------------------------------

// login standar
router.post("/auth", handleAdminLogin);

// registrar admin (solo el superadmin puede registrar nuevos administradores)
router.post("/register", auth(["superadmin"]), handleAdminRegister);

// obtener toda la info de los usuarios 
router.get("/user_info", auth(["admin", "superadmin"]), handleGetUsersInfo);

// Obtener info de usuario por ID
router.get("/users/:userId", auth(["admin", "superadmin"]), handleGetUserById);

// Actualizar rol de usuario [client, worker]
router.put("/users/:userId/role", auth(["admin", "superadmin"]), handleUpdateUserRole);

// Actualizar datos de usuario
router.put("/users/:userId", auth(["admin", "superadmin"]), handleUpdateUserInfo);

// Crear un nuevo usuario (sin verficación de mail)
router.post("/users", auth(["admin", "superadmin"]), handleCreateNewUser);

// Desactivar usuario
router.patch("/users/:userId", auth(["admin", "superadmin"]), handleDeactivateUser);

// Reactivar usuario
router.patch("/users/:userId/reactivate", auth(["admin", "superadmin"]), handleReactivateUser);

// Resetear usuario
router.patch("/users/:userId/reset_password", auth(["admin", "superadmin"]), handleUserPasswordReset);


// Admin account management -------------------------------------------------------------

// Obtener la lista de todos los admins
router.get("/admins", auth(["superadmin"]), handleGetAdminList);

// Desactivar un admin
router.patch("/admins/:adminId", auth(["superadmin"]), handleDeleteAdmin);

// Editar información de un admin
router.put("/admins/:adminId", auth(["admin", "superadmin"]), handleUpdateAdminInfo);

// Resetear contraseña de un admin
router.get("/admin/:adminId", auth(["superadmin"]), handleResetAdminPassword);


// Logs management ----------------------------------------------------------------------

// Obtener logs
router.get("/logs", auth(["admin", "superadmin"]), handleGetLogs);

// Obtener log por ID
router.get("/logs/:logId", auth(["admin", "superadmin"]), handleGetLogById);

// Eliminar log
router.delete("/logs/:logId", auth(["superadmin"]), handleDeleteLog);

// Filtrar logs
router.post("/logs/filter", auth(["admin", "superadmin"]), handleFilterLogs);

// Exportar logs a CSV
router.get("/logs/export", auth(["superadmin"]), handleExportLogs);

// Buscar entre los logs
router.post("/logs/search", auth(["admin", "superadmin"]), handleSearchLogs);


// Job management -----------------------------------------------------------------------

// Obtener todos los trabajos
router.get("/jobs", auth(["admin", "superadmin"]), handleGetAllJobs);

// Obtener trabjo por ID
router.get("/jobs/:jobId", auth(["admin", "superadmin"]), handleGetJobById);

// Crear trabajo
router.post("/jobs", auth(["admin", "superadmin"]), handleCreateJob);

// Actualizar trabajo
router.put("/jobs/:jobId", auth(["admin", "superadmin"]), handleUpdateJob);

// Eliminar trabajo
router.delete("/jobs/:jobId", auth(["admin", "superadmin"]), handleDeleteJob);

// Filtrar trabajo
router.get("/job_filter", auth(["admin", "superadmin"]), handleFilterJobs);

// Obtener categorías de trabajo
router.get("/job_categories", auth(), handleGetJobCategories);

// Crear categiorías de trabajo ([] o "")
router.post("/job_categories", auth(["admin", "superadmin"]), handleCreateJobCategory);

// Desactivar categoría (soft delete), sin implementar
// router.delete("/jobs/categories/:categoryId", auth(["admin"]), handleDeleteJobCategory);

// Eliminar categoría (si no es utilizada en ninguna parte)
router.delete("/job_categories/:categoryId", auth(["admin", "superadmin"]), handleDeleteJobCategory);

// User activity management

// Obtener actividad de usuario
router.get("/users/:userId/activity", auth(["admin", "superadmin"]), handleGetUserActivityLogs);

// Generar reporte de usuario
router.post("/users/report", auth(["admin", "superadmin"]), handleGenerateUserReport);

// Exportar lista de usuarios
router.get("/users/export", auth(["admin", "superadmin"]), handleExportUserList);

export default router;