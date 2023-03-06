const jwt = require('jsonwebtoken');
const { SECRET } = require('./config.js');

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        jwt.verify(authorization.substring(7), SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).json({ error: 'Token is not valid' });
          }
          req.userId = decoded.id;
        });
    } else {
        return res.status(401).json({ error: 'token missing' });
    }

    next();
};

// Middleware to check for JWT token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token is not valid' });
      }
      req.userId = decoded.id;
      next();
    });
};
  
module.exports = { tokenExtractor, authMiddleware };
