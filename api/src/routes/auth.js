import express from "express";
import { login, register, logout } from "../controllers/auth.js";
import { isUserAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SECRET, URL_FE } from "../utils/config.js";

const router = express.Router();

const successLoginUrl = `${URL_FE}/login/success`;
const failureLoginUrl = `${URL_FE}/login`;

router.post("/login", login);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: failureLoginUrl, successRedirect: successLoginUrl, failureMessage: "Cannot login to Google, please try again later!" }),
    (req, res) => {
        console.log("Google callback", req.user);
        res.send("Thanks for signing in!");
    }
);
router.get("/user", isUserAuthenticated, (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET);
    let user = req.user.dataValues;
    res.status(200).json({ token, ...user });
});
router.post("/register", register);
router.post("/logout", logout);

export default router;
