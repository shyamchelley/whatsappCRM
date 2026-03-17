const db = require('../../config/database');
const { getIO } = require('../../config/socket');

function emitSafe(event, data) {
  try { getIO().emit(event, data); } catch {}
}

async function getAll(filters = {}, userRole, userId) {
  let query = db('leads')
    .join('pipeline_stages', 'leads.stage_id', 'pipeline_stages.id')
    .leftJoin('users', 'leads.assigned_to', 'users.id')
    .where('leads.is_deleted', false)
    .select(
      'leads.*',
      'pipeline_stages.name as stage_name',
      'pipeline_stages.color as stage_color',
      'users.name as assigned_name'
    )
    .orderBy('leads.updated_at', 'desc');

  if (userRole === 'agent') query = query.where('leads.assigned_to', userId);
  if (filters.stage_id) query = query.where('leads.stage_id', filters.stage_id);
  if (filters.source) query = query.where('leads.source', filters.source);
  if (filters.assigned_to) query = query.where('leads.assigned_to', filters.assigned_to);
  if (filters.search) {
    query = query.where((q) => {
      q.whereILike('leads.name', `%${filters.search}%`)
        .orWhereILike('leads.phone', `%${filters.search}%`)
        .orWhereILike('leads.email', `%${filters.search}%`);
    });
  }

  return query;
}

async function getById(id) {
  const lead = await db('leads')
    .join('pipeline_stages', 'leads.stage_id', 'pipeline_stages.id')
    .leftJoin('users', 'leads.assigned_to', 'users.id')
    .where('leads.id', id)
    .where('leads.is_deleted', false)
    .select(
      'leads.*',
      'pipeline_stages.name as stage_name',
      'pipeline_stages.color as stage_color',
      'users.name as assigned_name'
    )
    .first();

  if (!lead) throw Object.assign(new Error('Lead not found'), { status: 404 });
  return lead;
}

async function create(data, userId) {
  const stage = await db('pipeline_stages').orderBy('order_index').first();

  const [id] = await db('leads').insert({
    ...data,
    stage_id: data.stage_id || stage.id,
    assigned_to: data.assigned_to || userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  await db('activities').insert({
    lead_id: id,
    user_id: userId,
    type: 'lead_created',
    description: `Lead created from ${data.source || 'manual'}`,
    created_at: new Date().toISOString(),
  });

  const lead = await getById(id);
  emitSafe('lead:new', { lead });
  return lead;
}

async function update(id, data, userId) {
  await getById(id); // throws if not found
  await db('leads').where({ id }).update({ ...data, updated_at: new Date().toISOString() });
  const lead = await getById(id);
  emitSafe('lead:updated', { leadId: id, changes: data });
  return lead;
}

async function moveStage(id, newStageId, userId) {
  const lead = await getById(id);
  const oldStageId = lead.stage_id;

  const newStage = await db('pipeline_stages').where({ id: newStageId }).first();
  if (!newStage) throw Object.assign(new Error('Stage not found'), { status: 404 });

  await db('leads').where({ id }).update({ stage_id: newStageId, updated_at: new Date().toISOString() });

  await db('activities').insert({
    lead_id: id,
    user_id: userId,
    type: 'stage_change',
    description: `Moved from "${lead.stage_name}" to "${newStage.name}"`,
    metadata: JSON.stringify({ old_stage_id: oldStageId, new_stage_id: newStageId, old_stage: lead.stage_name, new_stage: newStage.name }),
    created_at: new Date().toISOString(),
  });

  const updated = await getById(id);
  emitSafe('pipeline:card_moved', { leadId: id, fromStageId: oldStageId, toStageId: newStageId, lead: updated });
  return updated;
}

async function softDelete(id) {
  await getById(id);
  await db('leads').where({ id }).update({ is_deleted: true, updated_at: new Date().toISOString() });
}

async function getActivities(leadId, page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  return db('activities')
    .leftJoin('users', 'activities.user_id', 'users.id')
    .where('activities.lead_id', leadId)
    .select('activities.*', 'users.name as user_name')
    .orderBy('activities.created_at', 'desc')
    .limit(limit)
    .offset(offset);
}

module.exports = { getAll, getById, create, update, moveStage, softDelete, getActivities };
