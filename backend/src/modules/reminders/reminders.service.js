const db = require('../../config/database');

async function getByLead(leadId) {
  return db('reminders').where({ lead_id: leadId }).orderBy('due_at', 'asc');
}

async function create(leadId, data, userId) {
  const [id] = await db('reminders').insert({
    lead_id: leadId, user_id: userId,
    message: data.message, due_at: data.due_at,
    created_at: new Date().toISOString(),
  });
  await db('activities').insert({
    lead_id: leadId, user_id: userId, type: 'reminder_set',
    description: `Reminder set for ${new Date(data.due_at).toLocaleString()}: "${data.message}"`,
    created_at: new Date().toISOString(),
  });
  return db('reminders').where({ id }).first();
}

async function update(id, data) {
  await db('reminders').where({ id }).update({ ...data, notified: false });
  return db('reminders').where({ id }).first();
}

async function remove(id) {
  await db('reminders').where({ id }).delete();
}

module.exports = { getByLead, create, update, remove };
