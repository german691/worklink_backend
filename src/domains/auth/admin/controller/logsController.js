import { Log } from "../../../../middleware/logs/model/logSchema.js";
import { stringify } from "csv-stringify";
import { handleError } from "../../../../util/errorHandler.js";

const verifyLogExists = async (logId) => {
  const log = await Log.findById(logId);
  if (!log) handleError("Log not found", 404);
  return log;
};

export const getAllLogs = async (offset = 0, limit = 10) => {
  const [logs, total] = await Promise.all([
    Log.find().sort({ timestamp: -1 }).skip(offset).limit(limit),
    Log.countDocuments(),
  ]);
  if (!logs.length) handleError("No logs found", 404);
  return { logs, total };
};

export const getLogById = async (logId) => {
  const log = await verifyLogExists(logId);
  return log;
};

export const deleteLogById = async (logId) => {
  const log = await verifyLogExists(logId);
  if (log) {
    await Log.findByIdAndDelete(logId);
  }
  return { message: "Log deleted successfully" };
};

export const filterLogs = async (filter) => {
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

  const query = Object.entries({
    ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
    ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
    ...(userId && { userId }),
    ...(username && { username }),
    ...(ipAddress && { ipAddress }),
    ...(requestMethod && { requestMethod }),
    ...(requestUrl && { requestUrl: { $regex: requestUrl, $options: 'i' } }),
    ...(responseStatusCode && { responseStatusCode }),
    ...(minResponseTime && { responseTime: { $gte: minResponseTime } }),
    ...(maxResponseTime && { responseTime: { $lte: maxResponseTime } }),
    ...(actionType && { actionType }),
    ...(userAgent && { userAgent: { $regex: userAgent, $options: 'i' } }),
    ...(sessionId && { sessionId })
  }).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const logs = await Log.find(query).sort({ timestamp: -1 });
  if (!logs.length) handleError("No logs found for the given filter", 404);
  return logs;
};


export const exportLogs = async () => {
  const logs = await Log.find();
  if (!logs.length) handleError("No logs available for export", 404);
  return stringify(logs, { header: true });
};

export const searchLogs = async (searchTerm) => {
  const regex = new RegExp(searchTerm, "i");
  const logs = await Log.find({
    $or: [
      { username: regex },
      { requestUrl: regex },
      { actionType: regex },
    ],
  }).sort({ timestamp: -1 });
  if (!logs.length) handleError("No logs found for the search term", 404);
  return logs;
};
