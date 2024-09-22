import { hashData, verifyHashedData } from "../../../../util/hashData.js";
import createToken from "../../../../util/createToken.js";
import { _encrypt } from "../../../../util/cryptData.js";
import { Admin } from "../model.js";

export const authenticateAdmin = async (username, password) => {
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error("Invalid username");

  const isMatch = await verifyHashedData(password, admin.password);
  if (!isMatch) throw new Error("Incorrect password");

  if (!admin.isActive) Error("Admin account currently deactivated. Contact Superadmin.");

  return createToken({ userId: admin._id, username: admin.username, userType: admin.userType });
};

export const createNewAdmin = async (username, password) => {
  if (!username || !password) throw new Error("Username and password are required");

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) throw new Error("Username is not available");

  const hashedPassword = await hashData(password);
  const newAdmin = new Admin({ username, password: hashedPassword });
  return newAdmin.save();
};

export const updateAdminInfo = async (adminId, updates) => Admin.findByIdAndUpdate(adminId, updates, { new: true });

export const resetAdminPassword = async (userId, newPassword) => {
  const hashedPassword = await hashData(newPassword);
  return Admin.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

export const getAdminList = async () => Admin.find();

export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;
  const admin = await Admin.findById(adminId);
  if (!admin) return res.status(404).send("Admin not found");
  admin.isActive = false;
  await admin.save();
  res.status(200).send("Admin soft deleted successfully");
};
