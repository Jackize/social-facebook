const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");

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

module.exports = { authMiddleware };
