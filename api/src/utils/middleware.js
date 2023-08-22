const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

// Middleware to check for JWT token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const user = jwt.verify(token, SECRET);
        req.userId = user.id;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

const cachedUser = (req, res, next) => {
    const { userId } = req.params;
    redisStore.get(userId, (err, user) => {
        if (err) throw err;
        if (user) {
            res.sendStatus(200).json(user);
        } else {
            next();
        }
    });
};

module.exports = {
    authMiddleware,
    cachedUser
}