exports.up = async function up(knex) {
    const columns = await knex("information_schema.columns")
        .select("column_name")
        .where({ table_schema: "public", table_name: "users" });
    const existing = new Set(columns.map(column => column.column_name));

    const renames = [
        ["userid", "UserID"],
        ["username", "name"],
        ["userpass", "password"],
        ["usermail", "email"],
    ];

    for (const [oldName, newName] of renames) {
        if (existing.has(oldName) && !existing.has(newName)) {
            await knex.schema.alterTable("users", table => table.renameColumn(oldName, newName));
            existing.delete(oldName);
            existing.add(newName);
        }
    }
};

exports.down = async function down(knex) {
    const columns = await knex("information_schema.columns")
        .select("column_name")
        .where({ table_schema: "public", table_name: "users" });
    const existing = new Set(columns.map(column => column.column_name));

    const renames = [
        ["UserID", "userid"],
        ["name", "username"],
        ["password", "userpass"],
        ["email", "usermail"],
    ];

    for (const [oldName, newName] of renames) {
        if (existing.has(oldName) && !existing.has(newName)) {
            await knex.schema.alterTable("users", table => table.renameColumn(oldName, newName));
            existing.delete(oldName);
            existing.add(newName);
        }
    }
};
