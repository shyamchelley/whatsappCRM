const express = require('express');
const router = express.Router();
const controller = require('./whatsapp.controller');
const { webhookLimiter } = require('../../middleware/rateLimiter');

// Meta webhook endpoints (public)
router.get('/whatsapp', controller.verify);
router.post('/whatsapp', webhookLimiter, controller.receive);

module.exports = router;
