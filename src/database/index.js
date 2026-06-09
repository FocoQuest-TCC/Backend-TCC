const knexfile = require("../")

const knex = require("knex")(knexfile["development"]);

module.exports = knex;