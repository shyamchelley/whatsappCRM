const express = require('express');
const router = express.Router();
const controller = require('./pipeline.controller');
const { auth, requireRole } = require('../../middleware/auth');

router.get('/board', auth, controller.getBoard);
router.get('/stages', auth, controller.getStages);
router.post('/stages', auth, requireRole('admin'), controller.createStage);
router.patch('/stages/reorder', auth, requireRole('admin'), controller.reorderStages);
router.patch('/stages/:id', auth, requireRole('admin'), controller.updateStage);
router.delete('/stages/:id', auth, requireRole('admin'), controller.deleteStage);

module.exports = router;
