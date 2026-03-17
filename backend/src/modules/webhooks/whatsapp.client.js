/**
 * WhatsApp client powered by whatsapp-web.js
 * - Scans a QR code once, then stays connected
 * - Inbound messages auto-create/update leads in the CRM
 * - Outbound messages sent via client.sendMessage()
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { getIO } = require('../../config/socket');
const db = require('../../config/database');

let client = null;
let status = 'disconnected'; // disconnected | qr | connecting | ready

function getStatus() { return status; }
function getClient() { return client; }

function emitSafe(event, data) {
  try { getIO().emit(event, data); } catch {}
}

function normalizePhone(phone) {
  // whatsapp-web.js gives numbers like "601234567890@c.us"
  const raw = phone.replace('@c.us', '').replace(/\D/g, '');
  return '+' + raw;
}

async function processInboundMessage(msg) {
  if (msg.fromMe) return; // skip messages we sent
  if (!msg.from.endsWith('@c.us')) return; // skip group messages

  const phone = normalizePhone(msg.from);
  const contact = await msg.getContact();
  const name = contact.pushname || contact.name || null;
  const messageText = msg.body || `[${msg.type}]`;
  const waContactId = msg.from;
  const waMessageId = msg.id._serialized;

  // Deduplicate
  const existing = await db('whatsapp_messages').where({ wa_message_id: waMessageId }).first();
  if (existing) return;

  let lead = await db('leads').where({ wa_phone_number: phone, is_deleted: false }).first();

  if (!lead) {
    const firstStage = await db('pipeline_stages').orderBy('order_index').first();
    const [leadId] = await db('leads').insert({
      name,
      phone,
      source: 'whatsapp',
      stage_id: firstStage.id,
      wa_contact_id: waContactId,
      wa_phone_number: phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await db('activities').insert({
      lead_id: leadId,
      type: 'lead_created',
      description: `New lead from WhatsApp: "${messageText}"`,
      created_at: new Date().toISOString(),
    });

    const [msgId] = await db('whatsapp_messages').insert({
      lead_id: leadId, wa_message_id: waMessageId,
      direction: 'inbound', body: messageText,
      status: 'read', created_at: new Date().toISOString(),
    });

    lead = await db('leads').where({ id: leadId }).first();
    const newMsg = await db('whatsapp_messages').where({ id: msgId }).first();
    emitSafe('lead:new', { lead });
    emitSafe('whatsapp:message', { leadId: leadId, message: newMsg });
  } else {
    await db('activities').insert({
      lead_id: lead.id,
      type: 'whatsapp_received',
      description: messageText,
      created_at: new Date().toISOString(),
    });

    const [msgId] = await db('whatsapp_messages').insert({
      lead_id: lead.id, wa_message_id: waMessageId,
      direction: 'inbound', body: messageText,
      status: 'read', created_at: new Date().toISOString(),
    });

    await db('leads').where({ id: lead.id }).update({ updated_at: new Date().toISOString() });

    const newMsg = await db('whatsapp_messages').where({ id: msgId }).first();
    emitSafe('whatsapp:message', { leadId: lead.id, message: newMsg });
  }
}

function initWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './data/wa-session' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  });

  client.on('qr', async (qr) => {
    status = 'qr';
    console.log('[WhatsApp] QR code ready — scan it in the CRM Settings page');
    // Convert QR to data URL and broadcast to all connected clients
    const qrDataUrl = await qrcode.toDataURL(qr);
    emitSafe('whatsapp:qr', { qr: qrDataUrl });
  });

  client.on('loading_screen', () => {
    status = 'connecting';
    emitSafe('whatsapp:status', { status: 'connecting' });
  });

  client.on('ready', () => {
    status = 'ready';
    console.log('[WhatsApp] Client ready!');
    emitSafe('whatsapp:status', { status: 'ready' });
  });

  client.on('authenticated', () => {
    status = 'connecting';
    emitSafe('whatsapp:status', { status: 'connecting' });
  });

  client.on('auth_failure', () => {
    status = 'disconnected';
    emitSafe('whatsapp:status', { status: 'disconnected' });
  });

  client.on('disconnected', () => {
    status = 'disconnected';
    console.log('[WhatsApp] Disconnected');
    emitSafe('whatsapp:status', { status: 'disconnected' });
  });

  client.on('message', processInboundMessage);

  client.initialize().catch((err) => {
    console.error('[WhatsApp] Init error:', err.message);
    status = 'disconnected';
  });
}

async function sendMessage(leadId, text, userId) {
  const lead = await db('leads').where({ id: leadId, is_deleted: false }).first();
  if (!lead) throw Object.assign(new Error('Lead not found'), { status: 404 });
  if (status !== 'ready') throw Object.assign(new Error('WhatsApp not connected'), { status: 503 });

  const phone = lead.wa_phone_number || lead.phone;
  if (!phone) throw Object.assign(new Error('Lead has no phone number'), { status: 400 });

  // Format: "601234567890@c.us"
  const chatId = phone.replace('+', '') + '@c.us';
  await client.sendMessage(chatId, text);

  const [msgId] = await db('whatsapp_messages').insert({
    lead_id: leadId, direction: 'outbound', body: text,
    status: 'sent', sent_by: userId, created_at: new Date().toISOString(),
  });

  await db('activities').insert({
    lead_id: leadId, user_id: userId,
    type: 'whatsapp_sent', description: text,
    created_at: new Date().toISOString(),
  });

  const msg = await db('whatsapp_messages').where({ id: msgId }).first();
  emitSafe('whatsapp:message', { leadId, message: msg });
  return msg;
}

async function getMessages(leadId) {
  return db('whatsapp_messages')
    .leftJoin('users', 'whatsapp_messages.sent_by', 'users.id')
    .where('whatsapp_messages.lead_id', leadId)
    .select('whatsapp_messages.*', 'users.name as sender_name')
    .orderBy('whatsapp_messages.created_at', 'asc');
}

module.exports = { initWhatsApp, getStatus, getClient, sendMessage, getMessages };
