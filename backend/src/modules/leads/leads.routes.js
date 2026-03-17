const express = require('express');
const router = express.Router();
const controller = require('./leads.controller');
const { auth } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./leads.schema');

router.get('/', auth, controller.getAll);
router.post('/', auth, validate(schema.createLead), controller.create);
router.get('/:id', auth, controller.getById);
router.patch('/:id', auth, validate(schema.updateLead), controller.update);
router.delete('/:id', auth, controller.remove);
router.patch('/:id/stage', auth, validate(schema.moveStage), controller.moveStage);
router.get('/:id/activities', auth, controller.getActivities);

module.exports = router;
