const dotenv = require("dotenv");

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const URL_FE = process.env.URL_FE;
const URL_BE = process.env.URL_BE;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;

module.exports = {
    DATABASE_URL,
    PORT,
    SECRET,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET,
    OPENAI_API_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    URL_FE,
    URL_BE,
    REDIS_PORT,
    REDIS_HOST,
    JWT_EXPIRATION
}