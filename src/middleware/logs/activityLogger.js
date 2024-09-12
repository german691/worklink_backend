import { Log } from "./model/logSchema.js";

export const activityLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start;

        const logEntry = {
            userId: req.user ? req.user._id : null, 
            username: req.user ? req.user.username : null,
            ipAddress: req.ip,
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            requestBody: req.body,
            responseStatusCode: res.statusCode,
            responseTime: duration,
            userAgent: req.headers['user-agent'],
            sessionId: req.headers['session-id'] || null,
            actionType: req.method, 
            metadata: {}
        };

        try {
            await Log.create(logEntry);
        } catch (err) {
            console.error('Error al guardar el log en la base de datos:', err);
        }
    })

    next()
}