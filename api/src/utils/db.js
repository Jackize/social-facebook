const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");
const { info, error } = require("./logger");

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
        glob: "src/migrations/*",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
};

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();
    info("Migrations up to date", {
        files: migrations.map((mig) => mig.name),
    });

};
const rollbackMigration = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
};

module.exports = {
    connectToDatabase,
    runMigrations,
    rollbackMigration,
    sequelize,
}