const { URL_FE, SECRET, REDIS_PORT } = require("./src/utils/config");
const express = require("express");
const cors = require("cors");
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = require("path");
const api = require("./src/routes/index");
const { connectToDatabase } = require("./src/utils/db");
const passport = require("passport");
const { connectToRedis } = require("./src/utils/redis");
require("./src/sso/passport");
require("./src/sso/passportGoogle");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', URL_FE],
  credentials: true,
}));
app.use(cookieParser());
app.enable("trust proxy");
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
(async () => {
  await connectToDatabase();
  await connectToRedis();
})();

app.use("/api", api);
app.use("/hello", (req, res) => {
  res.send("Hello World!");
  console.log("Hello World!");
});
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "./build")));

// app.get("*", async (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

module.exports = app;
