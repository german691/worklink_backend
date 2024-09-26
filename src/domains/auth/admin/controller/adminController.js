import { hashData, verifyHashedData } from "../../../../util/hashData.js";
import createToken from "../../../../util/createToken.js";
import { _encrypt } from "../../../../util/cryptData.js";
import { Admin } from "../model.js";
import { handleError } from "../../../../util/errorHandler.js";

const verifyAdminExists = async (username) => {
  const admin = await Admin.findOne({ username });
  if (!admin) return handleError("Invalid username", 404);
  return admin;
};

export const authenticateAdmin = async (username, password) => {
  const admin = await verifyAdminExists(username);

  const isMatch = await verifyHashedData(password, admin.password);
  if (!isMatch) return handleError("Incorrect password", 401);

  if (!admin.isActive) handleError("Admin account currently deactivated. Contact Superadmin.", 403);

  return createToken({ userId: admin._id, username: admin.username, userType: admin.userType });
};

export const createNewAdmin = async (username, password) => {
  if (!username || !password) handleError("Username and password are required", 400);

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) return handleError("Username is not available", 409);

  const hashedPassword = await hashData(password);
  const newAdmin = new Admin({ username, password: hashedPassword });
  return newAdmin.save();
};

export const updateAdminInfo = async (adminId, updates) => {
  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, { new: true });
  if (!updatedAdmin) return handleError("Admin not found", 404);
  return updatedAdmin;
};

export const resetAdminPassword = async (userId, newPassword) => {
  const hashedPassword = await hashData(newPassword);
  const updatedAdmin = await Admin.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  if (!updatedAdmin) return handleError("Admin not found", 404);
  return updatedAdmin;
};

export const getAdminList = async () => {
  const admins = await Admin.find();
  return admins;
};

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) return res.status(404).send("Admin not found");
  
  admin.isActive = false;
  await admin.save();
  res.status(200).send("Admin soft deleted successfully");
};
