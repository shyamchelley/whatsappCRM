const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const leadsService = require('../leads/leads.service');

// Strict rate limit for the public widget endpoint
const widgetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                   // max 10 submissions per IP per window
  message: { error: 'Too many submissions. Please try again later.' },
});

// Allow cross-origin requests from any website that embeds the widget
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// POST /api/widget/lead — Public, protected by site token
router.post('/lead', widgetLimiter, async (req, res, next) => {
  try {
    const { name, phone, email, message, site_token } = req.body;

    // Allow any token in development for easy testing
    if (process.env.NODE_ENV === 'production' && site_token !== process.env.SITE_TOKEN) {
      return res.status(403).json({ error: 'Invalid site token' });
    }
    if (!phone || !phone.trim()) {
      return res.status(422).json({ error: 'Phone number is required' });
    }

    const lead = await leadsService.create(
      {
        name: name?.trim() || null,
        phone: phone.trim(),
        email: email?.trim() || null,
        source: 'website',
        // Store message text as the first note via a dedicated field
        lost_reason: message?.trim() || null,
      },
      null
    );

    // If message was provided, add it as a note on the lead
    if (message?.trim()) {
      const db = require('../../config/database');
      await db('notes').insert({
        lead_id: lead.id,
        content: `[Website enquiry]: ${message.trim()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    res.status(201).json({ success: true, id: lead.id });
  } catch (err) { next(err); }
});

// GET /api/widget/config — Optional: widget fetches its own config/branding
router.get('/config', (req, res) => {
  res.json({
    title: process.env.WIDGET_TITLE || 'Get in Touch',
    subtitle: process.env.WIDGET_SUBTITLE || "We'll get back to you shortly.",
    primaryColor: process.env.WIDGET_COLOR || '#6366f1',
  });
});

module.exports = router;
