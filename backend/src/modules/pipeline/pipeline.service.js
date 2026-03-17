const db = require('../../config/database');

async function getBoard(userRole, userId) {
  const stages = await db('pipeline_stages').orderBy('order_index');

  const leadsQuery = db('leads')
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

  if (userRole === 'agent') leadsQuery.where('leads.assigned_to', userId);

  const leads = await leadsQuery;

  return stages.map((stage) => ({
    ...stage,
    leads: leads.filter((l) => l.stage_id === stage.id),
  }));
}

async function getStages() {
  return db('pipeline_stages').orderBy('order_index');
}

async function createStage(data) {
  const maxOrder = await db('pipeline_stages').max('order_index as max').first();
  const [id] = await db('pipeline_stages').insert({
    ...data,
    order_index: (maxOrder.max || 0) + 1,
    created_at: new Date().toISOString(),
  });
  return db('pipeline_stages').where({ id }).first();
}

async function updateStage(id, data) {
  await db('pipeline_stages').where({ id }).update(data);
  return db('pipeline_stages').where({ id }).first();
}

async function deleteStage(id) {
  const leadsCount = await db('leads').where({ stage_id: id, is_deleted: false }).count('id as count').first();
  if (leadsCount.count > 0) {
    throw Object.assign(new Error('Cannot delete stage with active leads'), { status: 400 });
  }
  await db('pipeline_stages').where({ id }).delete();
}

async function reorderStages(orderedIds) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db('pipeline_stages').where({ id }).update({ order_index: index + 1 })
    )
  );
  return db('pipeline_stages').orderBy('order_index');
}

module.exports = { getBoard, getStages, createStage, updateStage, deleteStage, reorderStages };
