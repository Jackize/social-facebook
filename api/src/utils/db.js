const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");
const { info, error } = require("./logger");
const { exec } = require('child_process');

// Now you can use Sequelize, DATABASE_URL, Umzug, SequelizeStorage, and logger in your code

const sequelize = new Sequelize(DATABASE_URL, {
    logging: false,
});

// const sequelize = new Sequelize("social_facebook", "postgres", "123456", {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     logging: false,
// });

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // await runMigrations();
    } catch (err) {
        error("failed to connect to the database");
        error(err);
        setTimeout(connectToDatabase, 3000)
    }
};

const migrationConf = {
    migrations: {
        glob: "src/migrations/migrate-code.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
};

const runMigrations = async () => {
    exec(`cd src && npx sequelize-cli db:migrate --env ${process.env.NODE_ENV}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
};

const runAddSeedData = async () => {
    exec(`cd src && npx sequelize-cli db:seed:all --env ${process.env.NODE_ENV}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

const rollbackMigration = async () => {
    exec(`cd src && npx sequelize-cli db:migrate:undo --env ${process.env.NODE_ENV}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
};

module.exports = {
    connectToDatabase,
    runMigrations,
    rollbackMigration,
    runAddSeedData,
    sequelize,
}