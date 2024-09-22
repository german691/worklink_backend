import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    userId: String,             // ID del usuario, si está disponible
    username: String,           // Nombre de usuario, si está disponible
    ipAddress: String,          // Dirección IP del cliente
    requestMethod: String,      // Método HTTP
    requestUrl: String,         // URL solicitada
    requestBody: Object,        // Cuerpo de la solicitud
    responseStatusCode: Number, // Código de estado HTTP de la respuesta
    responseTime: Number,       // Tiempo de respuesta
    userAgent: String,          // Agente de usuario
    sessionId: String,          // ID de sesión, si está disponible
    actionType: String,         // Tipo de acción, si aplica
    metadata: Object            // Metadatos adicionales
});

const Log = mongoose.model('Log', logSchema);

export { Log };
