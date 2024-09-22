import jsonwebtoken from "jsonwebtoken"

const { TOKEN_KEY } = process.env;

const auth = (permissions) => {
    return (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["x-admin-token"];

        if (!token) {
            return res.status(403).send("An authentication token is required");
        }
            
        try {
            const decodedToken = jsonwebtoken.verify(token, TOKEN_KEY);
            req.currentUser = decodedToken;

            if (permissions && !permissions.includes(req.currentUser.userType)) {
                return res.status(401).send("Unauthorized access");
            }

            return next();
        } catch (error) {
            return res.status(401).send("Invalid token provided");
        }  
    };
};

export default auth;