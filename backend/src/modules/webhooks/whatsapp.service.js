const db = require('../../config/database');
const { getIO } = require('../../config/socket');
const { sendTextMessage } = require('./whatsapp.outbound');

function normalizePhone(phone) {
  return '+' + phone.replace(/\D/g, '');
}

function emitSafe(event, data) {
  try { getIO().emit(event, data); } catch {}
}

async function storeMessage(leadId, direction, body, waMessageId, sentBy) {
  // Deduplicate by wa_message_id
  if (waMessageId) {
    const existing = await db('whatsapp_messages').where({ wa_message_id: waMessageId }).first();
    if (existing) return existing;
  }
  const [id] = await db('whatsapp_messages').insert({
    lead_id: leadId,
    wa_message_id: waMessageId || null,
    direction,
    body,
    status: direction === 'inbound' ? 'read' : 'sent',
    sent_by: sentBy || null,
    created_at: new Date().toISOString(),
  });
  return db('whatsapp_messages').where({ id }).first();
}

async function processInboundMessage(payload) {
  const entry = payload.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;

  if (!value?.messages?.length) return;

  const message = value.messages[0];
  const contact = value.contacts?.[0];

  const rawPhone = message.from;
  const phone = normalizePhone(rawPhone);
  const name = contact?.profile?.name || null;
  const messageText = message.text?.body || `[${message.type}]`;
  const waContactId = contact?.wa_id || rawPhone;
  const waMessageId = message.id;

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
      metadata: JSON.stringify({ wa_message_id: waMessageId }),
      created_at: new Date().toISOString(),
    });

    await storeMessage(leadId, 'inbound', messageText, waMessageId, null);
    lead = await db('leads').where({ id: leadId }).first();
    emitSafe('lead:new', { lead });
  } else {
    await db('activities').insert({
      lead_id: lead.id,
      type: 'whatsapp_received',
      description: messageText,
      metadata: JSON.stringify({ wa_message_id: waMessageId, wa_contact_id: waContactId }),
      created_at: new Date().toISOString(),
    });

    await storeMessage(lead.id, 'inbound', messageText, waMessageId, null);
    await db('leads').where({ id: lead.id }).update({ updated_at: new Date().toISOString() });

    const newMsg = await db('whatsapp_messages').where({ wa_message_id: waMessageId }).first();
    emitSafe('whatsapp:message', { leadId: lead.id, message: newMsg });
  }
}

async function sendMessage(leadId, text, userId) {
  const lead = await db('leads').where({ id: leadId, is_deleted: false }).first();
  if (!lead) throw Object.assign(new Error('Lead not found'), { status: 404 });

  const phone = lead.wa_phone_number || lead.phone;
  if (!phone) throw Object.assign(new Error('Lead has no phone number'), { status: 400 });

  // Send via Meta API
  await sendTextMessage(phone, text);

  // Store the outbound message
  const msg = await storeMessage(leadId, 'outbound', text, null, userId);

  await db('activities').insert({
    lead_id: leadId,
    user_id: userId,
    type: 'whatsapp_sent',
    description: text,
    created_at: new Date().toISOString(),
  });

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

module.exports = { processInboundMessage, sendMessage, getMessages };
