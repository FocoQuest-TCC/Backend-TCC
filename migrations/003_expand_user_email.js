exports.up = function up(knex) {
    return knex.schema.alterTable("users", table => {
        table.string("email", 255).notNullable().alter();
    });
};

exports.down = function down(knex) {
    return knex.schema.alterTable("users", table => {
        table.string("email", 20).notNullable().alter();
    });
};
