const express = require('express');
const router = express.Router();
const controller = require('./notes.controller');
const { auth } = require('../../middleware/auth');

router.get('/:id/notes', auth, controller.getByLead);
router.post('/:id/notes', auth, controller.create);
router.patch('/:id/notes/:noteId', auth, controller.update);
router.delete('/:id/notes/:noteId', auth, controller.remove);

module.exports = router;
