exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('email', 200).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enum('role', ['admin', 'agent']).notNullable().defaultTo('agent');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
