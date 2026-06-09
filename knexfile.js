require("dotenv").config();

const config = {
    development:{
        client: "postgresql",
        connection:{
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            sll: true
        }
    }
}

module.exports = config;