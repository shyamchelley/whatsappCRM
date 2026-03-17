exports.up = function (knex) {
  return knex.schema.createTable('reminders', (table) => {
    table.increments('id').primary();
    table.integer('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('message').notNullable();
    table.timestamp('due_at').notNullable();
    table.boolean('is_done').notNullable().defaultTo(false);
    table.boolean('notified').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['due_at', 'is_done', 'notified']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('reminders');
};
