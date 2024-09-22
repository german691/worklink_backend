import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { Log } from "./model/logSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../../logs.txt');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

logStream.on('error', (err) => {
    console.error('Error al abrir el stream de logs:', err);
});

const activityLogger = (req, res, next) => {
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

            const errorLog = `${new Date().toISOString()} - Error: ${err.message}\n`;

            if (logStream.writable) {
                logStream.write(errorLog, (writeErr) => {
                    if (writeErr) {
                        console.error('Error al escribir en el archivo de logs:', writeErr);
                    } else {
                        console.log('Error guardado en logs.txt');
                    }
                });
            } else {
                console.error('El stream de escritura no está disponible.');
            }
        }
    });

    next();
};

process.on('exit', () => {
    logStream.end();
});

export default activityLogger;
