import { Log } from "./model/logSchema.js";

const activityLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const logEntry = {
            userId: req.currentUser ? req.currentUser.userId : null,
            username: req.currentUser ? req.currentUser.username : null,
            role: req.currentUser ? req.currentUser.userType : null,
            ipAddress: req.ip,
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            requestBody: req.body,
            responseStatusCode: res.statusCode,
            responseTime: duration,
            userAgent: req.headers['user-agent'],
            token: req.headers['x-access-token'] || req.headers['x-admin-token'] || (req.currentUser ? req.currentUser.decodedToken : null),
            actionType: req.method, 
        };

        try {
            await Log.create(logEntry);
        } catch (err) {
            console.error('Error saving log to the database:', err);
        }
    });

    next();
};

export default activityLogger;
