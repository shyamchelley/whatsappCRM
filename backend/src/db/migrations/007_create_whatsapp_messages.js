exports.up = function (knex) {
  return knex.schema.createTable('whatsapp_messages', (table) => {
    table.increments('id').primary();
    table.integer('lead_id').notNullable().references('id').inTable('leads').onDelete('CASCADE');
    table.string('wa_message_id', 100).unique();   // Meta message ID (for dedup)
    table.enum('direction', ['inbound', 'outbound']).notNullable();
    table.text('body').notNullable();
    table.enum('status', ['sent', 'delivered', 'read', 'failed']).defaultTo('sent');
    table.integer('sent_by').references('id').inTable('users').onDelete('SET NULL'); // null = inbound
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('lead_id');
    table.index('wa_message_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('whatsapp_messages');
};
