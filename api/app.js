const { URL_FE, SECRET, REDIS_PORT } = require("./src/utils/config");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const api = require("./src/routes/index");
const { connectToDatabase } = require("./src/utils/db");
const passport = require("passport");
require("./src/sso/passport");
require("./src/sso/passportGoogle");

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:3000", "https://social-facebook-beta.vercel.app", `${URL_FE}`],
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use(cookieParser());

(async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        error("Error connecting to the database:", error);
    }
})();

app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", api);
app.use("/hello", (req, res) => {
    res.send("Hello World!456");
});
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "./build")));

app.get("*", async (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

module.exports = app;
