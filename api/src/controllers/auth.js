const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { SECRET, JWT_EXPIRATION } = require('../utils/config');
const { error } = require('../utils/logger');

const salt = bcrypt.genSaltSync(10);

// handle register user endpoint api
const register = async (req, res) => {
    try {
        const { username, password, name } = req.body;
        
        // Validate input data
        if (!username || !password || !name) {
            return res.status(400).json('Missing required fields');
        }
        
        const [user, created] = await User.findOrCreate({ where: { username }, defaults: { password: bcrypt.hashSync(password, salt), name } });
        if (!created) {
            return res.status(409).json('User already exists');
        }
        
        res.status(200).json(user);
    
    } catch (err) {
        error('register error', err)
        res.status(500).json(err);
    }
};

/**
 * Handles the login endpoint API.
 * Validates the username and password fields, checks if the user exists in the database,
 * verifies the password, generates a JSON Web Token (JWT) if the password is correct,
 * and returns the user data along with the JWT as a response.
 *
 * @param {Object} req - The request object containing the username and password in the body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} - The response object with the appropriate status code and response body.
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    //Validate field
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        let user = await User.findOne({
            where: { username },
            raw: true,
        });
        if (user) {
            let checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) return res.status(400).json("Wrong username or password");
            const token = jwt.sign({ id: user.id }, SECRET, {
                expiresIn: JWT_EXPIRATION,
            });
            const { password: userPassword, ...other } = user;
            return res
                .cookie("access_token", token, { httpOnly: true, sameSite: true, expiresIn: JWT_EXPIRATION })
                .status(200)
                .json({ ...other });
        }
        return res.status(404).json('User not found');
    } catch (err) {
        error('login error', err)
        res.status(500).json(err);
    }
};

/**
 * Handles the logout endpoint API.
 * Clears the access_token cookie if it exists and returns a success message.
 * If the access_token cookie does not exist, it still returns a success message.
 * If any error occurs during the process, it returns an error message.
 * 
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 */
const logout = (req, res) => {
    try {
        if (req.cookies.access_token) {
            res.clearCookie('access_token', {
                secure: true,
                sameSite: 'none',
            })
                .status(200)
                .json('User has been logged out.');
        } else {
            res.status(200).json('User has been logged out.');
        }
    } catch (error) {
        res.status(500).json('Error occurred while logging out.');
    }
};

/**
 * Checks the validity of an access token.
 * @param {Object} req - The request object containing the cookies property.
 * @param {Object} res - The response object used to send the error response.
 * @param {Function} next - The next middleware function to be called if the token is valid.
 */
const authenticateToken = (req, res) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return res.status(403).json('Require access token');
  }
  
  try {
    const user = jwt.verify(token, SECRET);
    req.userId = user.id;
    res.json({ message: 'Token valid!!!', status: 200 })
  } catch (err) {
    return res.status(500).json('Verify token error');
  }
}

module.exports = { register, login, logout, authenticateToken };