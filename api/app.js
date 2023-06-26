import { URL_FE, SECRET, REDIS_PORT } from "./src/utils/config.js";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import api from "./src/routes/index.js";
import { connectToDatabase } from "./src/utils/db.js";
import passport from "passport";
import "./src/sso/passport.js";
import "./src/sso/passportGoogle.js";

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
    res.send("Hello World!");
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "./build")));

app.get("*", async (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

export default app;
