require("dotenv").config();

const config = {
    development:{
        client: "postgresql",
        connection: process.env.DATABASE_URL || {
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            ssl: process.env.PG_SSL === "true"
        },
        pool: {
            afterCreate: (connection, callback) => {
                connection.query("select 1", (error) => callback(error, connection));
            }
        }
    },
    migrations: {
        directory: "./migrations",
    }
}

module.exports = config;