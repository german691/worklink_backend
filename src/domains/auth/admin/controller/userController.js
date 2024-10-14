import { Log } from "../../../../middleware/logs/model/logSchema.js";
import { hashData } from "../../../../util/hashData.js";
import User from "../../user/model.js";
import { _encrypt } from "../../../../util/cryptData.js"; 
import { stringify } from "csv-stringify";
import { handleError } from "../../../../util/errorHandler.js";

const verifyUserExists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) handleError("User not found", 404);
  return user;
};

export const getUsersInfo = async () => {
  const users = await User.find();
  return users.map(user => ({
    userId: _encrypt(user._id.toString()),
    ...user._doc,
  }));
};

export const getUserById = async (userId) => {
  return await verifyUserExists(userId);
};

export const updateUserRole = async (userId, newRole) => {
  const user = await verifyUserExists(userId);
  user.role = newRole;
  return await user.save();
};

const checkUserExists = async (username, email) => {
  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username })
  ]);

  if (existingEmail) handleError("User with the provided email already exists", 409);
  if (existingUsername) handleError("User with the provided username already exists", 409);
};

export const createNewUser = async (value) => {
  const { username, email, password, verified } = value;

  await checkUserExists(username, email);
  const hashedPassword = await hashData(password);

  console.log(verified)

  const newUser = new User({
    ...value,
    password: hashedPassword, 
    verified: Boolean(verified)
  });

  return await newUser.save();
};

export const updateUserInfo = async (userId, updates) => {
  const user = await verifyUserExists(userId);
  Object.assign(user, updates);
  return await user.save();
};

export const deactivateUser = async (userId) => {
  const user = await verifyUserExists(userId);
  user.isActive = false;
  return await user.save();
};

export const reactivateUser = async (userId) => {
  const user = await verifyUserExists(userId);
  user.isActive = true;
  return await user.save();
};

export const userPasswordReset = async (userId, newPassword) => {
  const user = await verifyUserExists(userId);
  const hashedPassword = await hashData(newPassword);
  user.password = hashedPassword;
  return await user.save();
};

export const getUserActivityLogs = async (userId) => {
  await verifyUserExists(userId);
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
  if (!users.length) handleError("No users available for export", 404);
  return stringify(users, { header: true });
};
