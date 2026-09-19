exports.up = function up(knex) {
    return knex.schema.alterTable("users", table => {
        table.string("name", 120).notNullable().alter();
        table.text("password").notNullable().alter();
    });
};

exports.down = function down(knex) {
    return knex.schema.alterTable("users", table => {
        table.string("name", 30).notNullable().alter();
        table.string("password", 20).notNullable().alter();
    });
};
