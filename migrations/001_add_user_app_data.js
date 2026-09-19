exports.up = async function up(knex) {
    const hasUsersTable = await knex.schema.hasTable("users");
    if (!hasUsersTable) {
        await knex.schema.createTable("users", table => {
            table.increments("UserID").primary();
            table.string("name", 120).notNullable();
            table.string("email", 255).notNullable().unique();
            table.text("password").notNullable();
        });
    }

    const hasColumn = await knex.schema.hasColumn("users", "app_data");
    if (!hasColumn) {
        await knex.schema.alterTable("users", table => {
            table.jsonb("app_data").notNullable().defaultTo(JSON.stringify({
                tasks: [],
                habits: [],
                boards: [],
                kanbanTasks: [],
                inventory: [],
                gold: 0,
                gems: 0,
            }));
        });
    }
};

exports.down = function down(knex) {
    return knex.schema.alterTable("users", table => table.dropColumn("app_data"));
};