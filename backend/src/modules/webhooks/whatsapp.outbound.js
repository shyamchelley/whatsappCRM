const axios = require('axios');

const WA_BASE = 'https://graph.facebook.com/v19.0';

/**
 * Send a text message via WhatsApp Business Cloud API
 */
async function sendTextMessage(toPhone, text) {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const accessToken = process.env.WA_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken || accessToken === 'your_whatsapp_access_token') {
    throw Object.assign(
      new Error('WhatsApp API not configured. Set WA_PHONE_NUMBER_ID and WA_ACCESS_TOKEN in .env'),
      { status: 503 }
    );
  }

  const response = await axios.post(
    `${WA_BASE}/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toPhone,
      type: 'text',
      text: { preview_url: false, body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

/**
 * Send a template message (e.g. for first contact outside 24h window)
 */
async function sendTemplateMessage(toPhone, templateName, languageCode = 'en_US', components = []) {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const accessToken = process.env.WA_ACCESS_TOKEN;

  const response = await axios.post(
    `${WA_BASE}/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'template',
      template: { name: templateName, language: { code: languageCode }, components },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

module.exports = { sendTextMessage, sendTemplateMessage };
