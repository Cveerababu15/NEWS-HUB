const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token, "secretkey");
            req.user = decoded;
        }
        next();
    } catch (error) {
        // Just proceed without req.user if token is invalid
        next();
    }
}
