const remindersService = require('./reminders.service');

async function getByLead(req, res, next) {
  try { res.json(await remindersService.getByLead(req.params.id)); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const reminder = await remindersService.create(req.params.id, req.body, req.user.id);
    res.status(201).json(reminder);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const reminder = await remindersService.update(req.params.remId, req.body);
    res.json(reminder);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await remindersService.remove(req.params.remId);
    res.json({ message: 'Reminder deleted' });
  } catch (err) { next(err); }
}

module.exports = { getByLead, create, update, remove };
