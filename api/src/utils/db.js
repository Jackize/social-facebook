import Sequelize from "sequelize";
import { DATABASE_URL } from "./config.js";
import { Umzug, SequelizeStorage } from "umzug";
import { info, error } from "./logger.js";

// Now you can use Sequelize, DATABASE_URL, Umzug, SequelizeStorage, and logger in your code

export const sequelize = new Sequelize(DATABASE_URL, {
    logging: false,
});

// export const sequelize = new Sequelize("social_facebook", "postgres", "123456", {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     logging: false,
// });

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize
            .sync()
            .then(() => {
                console.log("Connected to the database and models synced");
            })
            .catch((err) => {
                console.error("Error connecting to the database:", err);
            });
        await runMigrations();
    } catch (err) {
        error("failed to connect to the database");
        error(err);
    }
};

export const migrationConf = {
    migrations: {
        glob: "src/migrations/*.js",
    },
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    context: sequelize.getQueryInterface(),
    logger: console,
};

export const runMigrations = async () => {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();
    info("Migrations up to date", {
        files: migrations.map((mig) => mig.name),
    });
};
export const rollbackMigration = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
};
