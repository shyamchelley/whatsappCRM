# WhatsApp Business API Setup Guide

## Overview
This CRM uses the **Meta WhatsApp Business Cloud API** (free tier) to:
- Auto-create leads from inbound WhatsApp messages
- Send outbound messages directly from the CRM lead detail page
- Show a full conversation thread per lead

---

## Step 1 — Create a Meta Developer Account

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **Get Started** and log in with your Facebook account
3. Verify your account with a phone number if prompted

---

## Step 2 — Create a Meta App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Click **Create App**
3. Select **Business** as the app type
4. Fill in App Name (e.g. "My CRM"), contact email, and select your Business Account
5. Click **Create App**

---

## Step 3 — Add WhatsApp Product

1. In your app dashboard, scroll to **Add Products to Your App**
2. Find **WhatsApp** and click **Set Up**
3. You'll be taken to the WhatsApp > Getting Started page
4. Note down:
   - **Phone Number ID** (e.g. `123456789012345`)
   - **WhatsApp Business Account ID**
5. Click **Generate Token** to get a temporary access token (use a System User token for production)

---

## Step 4 — Configure Webhook

Meta requires your webhook URL to be **publicly accessible over HTTPS**.

### For local development — use ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3001

# Note the HTTPS URL (e.g. https://abc123.ngrok.io)
```

### Register the webhook in Meta:
1. In your app, go to **WhatsApp > Configuration**
2. Under **Webhook**, click **Edit**
3. Set:
   - **Callback URL**: `https://YOUR_NGROK_URL/webhook/whatsapp`
   - **Verify Token**: the value you put in `WA_VERIFY_TOKEN` in your `.env`
4. Click **Verify and Save**
5. Under **Webhook Fields**, subscribe to: `messages`

---

## Step 5 — Update Your .env File

```env
WA_VERIFY_TOKEN=your_custom_random_string_here
WA_PHONE_NUMBER_ID=123456789012345
WA_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxx
```

> **Production tip**: Generate a permanent System User Token from your Meta Business Manager
> instead of the temporary token from the Getting Started page.

---

## Step 6 — Test the Integration

### Test inbound webhook (simulate a message):
```bash
# Start your backend
cd backend && npm run dev

# In another terminal, simulate an inbound WhatsApp message:
node test-webhook.js
```

This will create a new lead called **Ahmed Al-Rashid** from WhatsApp.

### Test outbound messaging:
1. Open the CRM in your browser
2. Navigate to any lead that came from WhatsApp
3. Click the **WhatsApp** tab
4. Type a message and click Send

> **Note**: Outbound messages only work if the lead messaged you within the last 24 hours
> (Meta's messaging window policy). For leads outside the window, use a pre-approved template.

---

## WhatsApp Messaging Limits

| Type | Description |
|------|-------------|
| **Free conversations** | 1,000 free user-initiated conversations/month |
| **Business-initiated** | Charged per message (after free tier) |
| **24-hour window** | You can reply freely within 24h of a user's message |
| **Outside window** | Must use a pre-approved template message |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook verification fails | Check `WA_VERIFY_TOKEN` matches what you entered in Meta |
| Messages not arriving | Ensure webhook is subscribed to `messages` field |
| Outbound fails with 503 | `WA_PHONE_NUMBER_ID` or `WA_ACCESS_TOKEN` not set in `.env` |
| Outbound fails with 131047 | Lead's last message was more than 24h ago — use a template |
| Duplicate leads | Ensure phone numbers are in E.164 format (+countrycode...) |

---

## Phone Number Format

All phone numbers are normalized to **E.164 format**:
- ✅ `+971501234567`
- ✅ `971501234567` → normalized to `+971501234567`
- ❌ `0501234567` (missing country code)

---

## Going Live

1. In Meta App Dashboard → **App Review** → request `whatsapp_business_messaging` permission
2. Switch your app from **Development** to **Live** mode
3. Add your production HTTPS URL as the webhook (replace ngrok with your server URL)
