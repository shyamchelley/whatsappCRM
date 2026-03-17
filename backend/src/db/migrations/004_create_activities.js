exports.up = function (knex) {
  return knex.schema.createTable('activities', (table) => {
    table.increments('id').primary();
    table.integer('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.enum('type', [
      'stage_change',
      'note_added',
      'whatsapp_received',
      'whatsapp_sent',
      'reminder_set',
      'lead_created',
      'manual',
    ]).notNullable();
    table.text('description').notNullable();
    table.text('metadata'); // JSON string
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('lead_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('activities');
};
