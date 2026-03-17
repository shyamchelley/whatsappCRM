const db = require('../../config/database');

async function getByLead(leadId) {
  return db('notes')
    .leftJoin('users', 'notes.user_id', 'users.id')
    .where('notes.lead_id', leadId)
    .select('notes.*', 'users.name as author')
    .orderBy('notes.created_at', 'desc');
}

async function create(leadId, content, userId) {
  const [id] = await db('notes').insert({
    lead_id: leadId, user_id: userId, content,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  });
  await db('activities').insert({
    lead_id: leadId, user_id: userId, type: 'note_added',
    description: `Note added: "${content.slice(0, 60)}${content.length > 60 ? '…' : ''}"`,
    created_at: new Date().toISOString(),
  });
  return db('notes').where({ id }).first();
}

async function update(id, content, userId) {
  await db('notes').where({ id, user_id: userId }).update({ content, updated_at: new Date().toISOString() });
  return db('notes').where({ id }).first();
}

async function remove(id, userId) {
  await db('notes').where({ id, user_id: userId }).delete();
}

module.exports = { getByLead, create, update, remove };
