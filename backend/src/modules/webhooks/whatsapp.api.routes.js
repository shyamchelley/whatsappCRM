const express = require('express');
const router = express.Router();
const controller = require('./whatsapp.controller');
const { auth } = require('../../middleware/auth');

// GET /api/whatsapp/:leadId/messages — Full conversation thread
router.get('/:leadId/messages', auth, controller.getMessages);

// POST /api/whatsapp/:leadId/send — Send a WhatsApp message
router.post('/:leadId/send', auth, controller.sendMessage);

module.exports = router;
