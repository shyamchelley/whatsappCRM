const leadsService = require('./leads.service');

async function getAll(req, res, next) {
  try {
    const leads = await leadsService.getAll(req.query, req.user.role, req.user.id);
    res.json(leads);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const lead = await leadsService.getById(req.params.id);
    res.json(lead);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const lead = await leadsService.create(req.body, req.user.id);
    res.status(201).json(lead);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const lead = await leadsService.update(req.params.id, req.body, req.user.id);
    res.json(lead);
  } catch (err) { next(err); }
}

async function moveStage(req, res, next) {
  try {
    const lead = await leadsService.moveStage(req.params.id, req.body.stage_id, req.user.id);
    res.json(lead);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await leadsService.softDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) { next(err); }
}

async function getActivities(req, res, next) {
  try {
    const activities = await leadsService.getActivities(req.params.id, req.query.page, req.query.limit);
    res.json(activities);
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, moveStage, remove, getActivities };
