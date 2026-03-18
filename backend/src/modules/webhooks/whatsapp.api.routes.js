const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { getStatus, sendMessage, getMessages } = require('./whatsapp.client');

// GET /api/whatsapp/status — connection status + QR info
router.get('/status', auth, (req, res) => {
  res.json({ status: getStatus() });
});

// GET /api/whatsapp/:leadId/messages
router.get('/:leadId/messages', auth, async (req, res, next) => {
  try { res.json(await getMessages(req.params.leadId)); } catch (err) { next(err); }
});

// POST /api/whatsapp/:leadId/send
router.post('/:leadId/send', auth, async (req, res, next) => {
  try {
    const msg = await sendMessage(req.params.leadId, req.body.text, req.user.id);
    res.json(msg);
  } catch (err) { next(err); }
});

module.exports = router;
