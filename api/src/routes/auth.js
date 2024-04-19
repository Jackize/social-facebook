const express = require("express");
const { login, register, logout, authenticateToken } = require("../controllers/auth");
const { isUserAuthenticated, registerValidator } = require("../middlewares/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { SECRET, URL_FE } = require("../utils/config");

const router = express.Router();

const successLoginUrl = `${URL_FE}/login/success`;
const failureLoginUrl = `${URL_FE}/login`;

router.post("/login", login);
router.get("/login/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: failureLoginUrl, successRedirect: successLoginUrl, failureMessage: "Cannot login to Google, please try again later!" }),
    (req, res) => { }
);
router.get("/user", isUserAuthenticated, (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET, {
        expiresIn: "1h",
    });
    res.cookie("access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json({ ...req.user })
});
router.post("/register", registerValidator, register);
router.post("/logout", logout);
router.post("/authenticateToken", authenticateToken)

module.exports = router;
