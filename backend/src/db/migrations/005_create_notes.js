exports.up = function (knex) {
  return knex.schema.createTable('notes', (table) => {
    table.increments('id').primary();
    table.integer('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.text('content').notNullable();
    table.timestamps(true, true);

    table.index('lead_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notes');
};
