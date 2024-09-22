import authSchema from "../../../../validation/adminSchemes.js";
import { 
  authenticateAdmin, 
  createNewAdmin,
  updateAdminInfo,
  resetAdminPassword,
  getAdminList,
  deleteAdmin
} from "../controller/adminController.js";
const handleErrorResponse = (res, error) => res.status(error.status || 400).json({ error: error.message });

export const handleAdminLogin = async (req, res) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const token = await authenticateAdmin(value.username, value.password);
    res.status(200).json({ token });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleAdminRegister = async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];
    if (key !== process.env.ADMIN_KEY) throw new Error("Unauthorized access.");

    const { error, value } = authSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const newAdmin = await createNewAdmin(value.username, value.password);
    res.status(200).json(newAdmin);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleUpdateAdminInfo = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminInfo(req.params.adminId, req.body);
    if (!updatedAdmin) throw new Error("Admin not found");
    res.status(200).json(updatedAdmin);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleResetAdminPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await resetAdminPassword(userId, newPassword);
    res.status(200).send("Password reset successfully");
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleGetAdminList = async (req, res) => {
  try {
    const admins = await getAdminList();
    res.status(200).json(admins);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleDeleteAdmin = async (req, res) => {
  try {
    await deleteAdmin(req, res);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
