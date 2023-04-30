const config = require("./src/utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require('express-session');
import cookieParser from "cookie-parser";
const path = require("path");
import api from "./src/routes/index.js";
import { connectToDatabase } from "./src/utils/db.js";
import passport from "passport";
require("./src/sso/passport.js")
require("./src/sso/passportGoogle.js")

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://social-facebook-beta.vercel.app",
            `${config.URL_FE}`,
        ],
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(cookieParser());

connectToDatabase();

app.use(
    session({
        secret: config.SECRET,
        resave: false,
        saveUninitialized: false,
        maxAge: 24 * 60 * 60 * 1000,
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", api);
app.use(express.static(path.join(__dirname, "build")));

app.get("*", async (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
module.exports = app;
