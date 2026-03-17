exports.up = function (knex) {
  return knex.schema.createTable('pipeline_stages', (table) => {
    table.increments('id').primary();
    table.string('name', 80).notNullable();
    table.integer('order_index').notNullable();
    table.string('color', 30).notNullable().defaultTo('#6366f1');
    table.boolean('is_terminal').notNullable().defaultTo(false);
    table.boolean('is_won').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pipeline_stages');
};
