const express = require('express');
const router = express.Router();
const controller = require('./dashboard.controller');
const { auth } = require('../../middleware/auth');

router.get('/stats', auth, controller.getStats);
router.get('/by-source', auth, controller.getBySource);
router.get('/by-stage', auth, controller.getByStage);
router.get('/recent', auth, controller.getRecent);
router.get('/reminders', auth, controller.getReminders);

module.exports = router;
