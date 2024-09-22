import { 
  getAllLogs, 
  getLogById, 
  deleteLogById, 
  filterLogs,
  exportLogs, 
  searchLogs 
} from "../controller/logsController.js";

const handleErrorResponse = (res, error) => res.status(error.status || 400).json({ error: error.message });

export const handleGetLogs = async (req, res) => {
  try {
    const logs = await getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleGetLogById = async (req, res) => {
  try {
    const log = await getLogById(req.params.logId);
    if (!log) throw new Error("Log not found");
    res.status(200).json(log);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleDeleteLog = async (req, res) => {
  try {
    const deletedLog = await deleteLogById(req.params.logId);
    if (!deletedLog) throw new Error("Log not found");
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleFilterLogs = async (req, res) => {
  try {
    const filteredLogs = await filterLogs(req.body);
    res.status(200).json(filteredLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleExportLogs = async (req, res) => {
  try {
    const csvData = await exportLogs();
    res.setHeader('Content-Type', 'text/csv');
    res.attachment('logs.csv');
    res.send(csvData);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const handleSearchLogs = async (req, res) => {
  try {
    const logs = await searchLogs(req.query.search);
    res.status(200).json(logs);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
