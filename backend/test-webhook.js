/**
 * Simulates a Meta WhatsApp inbound message webhook call.
 * Usage: node test-webhook.js
 *
 * This creates a new lead (or appends to existing) just as Meta would.
 */

require('dotenv').config();
const http = require('http');

const payload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'BUSINESS_ACCOUNT_ID',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '15550000000', phone_number_id: 'TEST_PHONE_ID' },
            contacts: [
              {
                profile: { name: 'Ahmed Al-Rashid' },
                wa_id: '971501234567',
              },
            ],
            messages: [
              {
                from: '971501234567',
                id: `wamid.test_${Date.now()}`,
                timestamp: String(Math.floor(Date.now() / 1000)),
                text: { body: 'Hi, I saw your product online. Can you send me more details?' },
                type: 'text',
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ],
};

const body = JSON.stringify(payload);
const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/webhook/whatsapp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
    console.log('\nWebhook test sent! Check the CRM — a new lead should have been created.');
    console.log('Lead name: Ahmed Al-Rashid');
    console.log('Lead phone: +971501234567');
    console.log('Source: whatsapp');
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();
