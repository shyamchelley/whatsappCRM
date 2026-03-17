const whatsappService = require('./whatsapp.service');

// GET /webhook/whatsapp — Meta hub verification
function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    return res.status(200).send(challenge);
  }

  res.status(403).json({ error: 'Verification failed' });
}

// POST /webhook/whatsapp — Inbound messages
async function receive(req, res) {
  // Always respond 200 fast to Meta — process async
  res.status(200).json({ status: 'ok' });
  try {
    await whatsappService.processInboundMessage(req.body);
  } catch (err) {
    console.error('WhatsApp webhook error:', err.message);
  }
}

// GET /api/whatsapp/:leadId/messages — Conversation thread
async function getMessages(req, res, next) {
  try {
    const messages = await whatsappService.getMessages(req.params.leadId);
    res.json(messages);
  } catch (err) { next(err); }
}

// POST /api/whatsapp/:leadId/send — Send a message
async function sendMessage(req, res, next) {
  try {
    const msg = await whatsappService.sendMessage(req.params.leadId, req.body.text, req.user.id);
    res.json(msg);
  } catch (err) { next(err); }
}

module.exports = { verify, receive, getMessages, sendMessage };
