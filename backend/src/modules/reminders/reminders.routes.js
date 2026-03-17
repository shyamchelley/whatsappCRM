const express = require('express');
const router = express.Router();
const controller = require('./reminders.controller');
const { auth } = require('../../middleware/auth');

router.get('/:id/reminders', auth, controller.getByLead);
router.post('/:id/reminders', auth, controller.create);
router.patch('/:id/reminders/:remId', auth, controller.update);
router.delete('/:id/reminders/:remId', auth, controller.remove);

module.exports = router;
