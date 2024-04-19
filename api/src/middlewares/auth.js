const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).send("You must login first!");
    }
}

const registerValidator = validate(checkSchema({
    username: {
        in: 'body',
        isrequired: { errorMessage: 'Username is required' },
        isString: { errorMessage: 'Username is string' },
        errorMessage: 'Username is required',
        notEmpty: { errorMessage: 'Username is required' },
        trim: true,
    },
    password: {
        in: 'body',
        isString: { errorMessage: 'Password is string' },
        errorMessage: 'Password is required',
        notEmpty: { errorMessage: 'Password is required' },
        trim: true,
    },
    name: {
        in: 'body',
        isString: { errorMessage: 'Password is string' },
        errorMessage: 'Name is required',
        notEmpty: { errorMessage: 'Name is required' },
        trim: true,
    },
}))

module.exports = { isUserAuthenticated, registerValidator }