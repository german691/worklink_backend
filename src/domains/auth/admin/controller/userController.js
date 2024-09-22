import { Log } from "../../../../middleware/logs/model/logSchema.js";
import { hashData } from "../../../../util/hashData.js";
import User from "../../user/model.js";
import { _encrypt } from "../../../../util/cryptData.js"; 
import { stringify } from "csv-stringify";

export const getUsersInfo = async () => {
  const users = await User.find();
  return users.map(user => ({
    userId: _encrypt(user._id.toString()),
    ...user._doc,
  }));
};

export const getUserById = async userId => User.findById(userId);

export const updateUserRole = async (userId, newRole) => User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

export const createNewUser = async (userData) => {
  const { username, password, role, email } = userData;
  if (!username || !password || !email) throw new Error("Missing required fields");
  
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error("Username already taken");

  const hashedPassword = await hashData(password);
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    role,
    isActive: true,
    createdAt: new Date()
  });
  
  return newUser.save();
};

export const updateUserInfo = async (userId, updates) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
  return updatedUser;
};

export const deactivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.isActive = false;
  return user.save();
};

export const reactivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.isActive = true;
  return user.save();
};

export const userPasswordReset = async (userId, newPassword) => {
  const hashedPassword = await hashData(newPassword);
  return User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

export const getUserActivityLogs = async (userId) => {
  const logs = await Log.find({ userId }).sort({ timestamp: -1 });
  return logs;
};

export const generateUserReport = async (filter) => {
  const { startDate, endDate, isActive } = filter;
  const query = {};
  if (startDate) query.createdAt = { $gte: new Date(startDate) };
  if (endDate) query.createdAt = { $lte: new Date(endDate) };
  if (isActive !== undefined) query.isActive = isActive;
  
  const users = await User.find(query);
  return users.map(user => ({
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    isActive: user.isActive,
  }));
};

export const exportUserList = async () => {
  const users = await User.find();
  return stringify(users, { header: true });
};
