const express = require("express");
const { login, register, logout } = require("../controllers/auth");
const { isUserAuthenticated } = require("../middlewares/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { SECRET, URL_FE } = require("../utils/config");

const router = express.Router();

const successLoginUrl = `${URL_FE}/login/success`;
const failureLoginUrl = `${URL_FE}/login`;

router.post("/login", login);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: failureLoginUrl, successRedirect: successLoginUrl, failureMessage: "Cannot login to Google, please try again later!" }),
    (req, res) => {
        res.redirect('/');
    }
);
router.get("/user", (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET);
    res.status(200).json({ token, ...req.user });
});
router.post("/register", register);
router.post("/logout", logout);

module.exports = router;
