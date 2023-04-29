require('dotenv').config();

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 3001,
    SECRET: process.env.SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};
