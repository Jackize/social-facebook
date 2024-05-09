const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).send("You must login first!");
    }
}

module.exports = { isUserAuthenticated }