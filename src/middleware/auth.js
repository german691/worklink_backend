const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
    // Esperamos tener un token disponible en la solicitud, aca verificamos eso basicamente
    // Pueden existir 3 formas de recibir el token, por el body del documento (osea, un json)
    // por un query param (osea, mediante URL), o como header de la request que enviamos 
    // desde postman o un navegador, que normalmente se expresa con "x-access-token"
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
        
    // Si no hay un token, obviamente denegamos el acceso a X recurso.
    if (!token) {
        return res.status(403).send("An authentication token is required");
    }

    // Acá ahora necesitamos validar la veracidad de ese token mediante el token recibido
    // y nuestro key de tokens principal
    try {
        const decodedToken = await jwt.verify(token, TOKEN_KEY);
        req.currentUser = decodedToken;
    } catch (error) {
        return res.status(401).send("Invalid token provided");
    }  

    // Si todo sale bien, procedemos con la solicitud
    return next();
};

// Estamos reteniendo las respuestas y no simplemente respondemos con un error.message
// así nos aseguramos que si el token es inválido o inexistente, no procedemos a enviar
// la solicitud

module.exports = verifyToken;

        