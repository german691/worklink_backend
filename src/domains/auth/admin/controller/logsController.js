import { Log } from "../../../../middleware/logs/model/logSchema.js";
import { stringify } from "csv-stringify";

export const getAllLogs = async (offset = 0, limit = 10) => {
  const [logs, total] = await Promise.all([
    Log.find().sort({ timestamp: -1 }).skip(offset).limit(limit),
    Log.countDocuments(),
  ]);
  return { logs, total };
};

export const getLogById = async logId => Log.findById(logId);

export const deleteLogById = async logId => Log.findByIdAndDelete(logId);

export const filterLogs = async (filter) => {
  try {
    const {
      startDate,
      endDate,
      userId,
      username,
      ipAddress,
      requestMethod,
      requestUrl,
      responseStatusCode,
      minResponseTime,
      maxResponseTime,
      actionType,
      userAgent,
      sessionId
    } = filter;

    const query = {};
    if (startDate) query.timestamp = { $gte: new Date(startDate) };
    if (endDate) query.timestamp = { $lte: new Date(endDate) };
    if (userId) query.userId = userId;
    if (username) query.username = username;
    if (ipAddress) query.ipAddress = ipAddress;
    if (requestMethod) query.requestMethod = requestMethod;
    if (requestUrl) query.requestUrl = { $regex: requestUrl, $options: 'i' };
    if (responseStatusCode) query.responseStatusCode = responseStatusCode;
    if (minResponseTime) query.responseTime = { $gte: minResponseTime };
    if (maxResponseTime) query.responseTime = { $lte: maxResponseTime };
    if (actionType) query.actionType = actionType;
    if (userAgent) query.userAgent = { $regex: userAgent, $options: 'i' };
    if (sessionId) query.sessionId = sessionId;

    return await Log.find(query).sort({ timestamp: -1 });
  } catch (error) {
    throw error;
  }
};

export const exportLogs = async () => {
  const logs = await Log.find();
  return stringify(logs, { header: true });
};

export const searchLogs = async searchTerm => {
  const regex = new RegExp(searchTerm, "i");
  return Log.find({
    $or: [
      { username: regex },
      { requestUrl: regex },
      { actionType: regex },
    ],
  }).sort({ timestamp: -1 });
};
