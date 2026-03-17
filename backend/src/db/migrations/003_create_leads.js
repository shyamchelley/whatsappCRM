exports.up = function (knex) {
  return knex.schema.createTable('leads', (table) => {
    table.increments('id').primary();
    table.string('name', 150);
    table.string('phone', 30).notNullable();
    table.string('email', 200);
    table.enum('source', ['whatsapp', 'website', 'manual']).notNullable().defaultTo('manual');
    table.integer('stage_id').notNullable().references('id').inTable('pipeline_stages');
    table.integer('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.decimal('deal_value', 12, 2).defaultTo(0);
    table.string('wa_contact_id', 100);
    table.string('wa_phone_number', 30);
    table.text('lost_reason');
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.index('stage_id');
    table.index('phone');
    table.index('wa_contact_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('leads');
};
