import { handleError, handleErrorResponse } from "../../../../util/errorHandler.js";
import authSchema from "../../../../validation/adminSchemes.js";
import { 
  authenticateAdmin, 
  createNewAdmin,
  updateAdminInfo,
  resetAdminPassword,
  getAdminList,
  deleteAdmin
} from "../controller/adminController.js";

export const handleAdminLogin = async (req, res) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const token = await authenticateAdmin(value.username, value.password);
    res.status(200).json({ token });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleAdminRegister = async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];
    if (key !== process.env.ADMIN_KEY) throw new Error("Unauthorized access.");

    const { error, value } = authSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const newAdmin = await createNewAdmin(value.username, value.password);
    res.status(200).json(newAdmin);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleUpdateAdminInfo = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminInfo(req.params.adminId, req.body);
    if (!updatedAdmin) return handleError("Admin not found", 404);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleResetAdminPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await resetAdminPassword(userId, newPassword);
    res.status(200).send("Password reset successfully");
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleGetAdminList = async (req, res) => {
  try {
    const admins = await getAdminList();
    res.status(200).json(admins);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const handleDeleteAdmin = async (req, res) => {
  try {
    await deleteAdmin(req, res);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
