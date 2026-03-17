const notesService = require('./notes.service');

async function getByLead(req, res, next) {
  try { res.json(await notesService.getByLead(req.params.id)); } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const note = await notesService.create(req.params.id, req.body.content, req.user.id);
    res.status(201).json(note);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const note = await notesService.update(req.params.noteId, req.body.content, req.user.id);
    res.json(note);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await notesService.remove(req.params.noteId, req.user.id);
    res.json({ message: 'Note deleted' });
  } catch (err) { next(err); }
}

module.exports = { getByLead, create, update, remove };
