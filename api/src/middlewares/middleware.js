const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

// Middleware to check for JWT token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        const user = jwt.verify(token, SECRET);
        req.userId = user.id;
        next();
    } catch (err) {
        return res.sendStatus(401);
    }
};

const isUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send("You must login first!");
    }
}

module.exports = {
    authMiddleware,
    isUserAuthenticated
}