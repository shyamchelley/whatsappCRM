require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const leadsRoutes = require('./modules/leads/leads.routes');
const pipelineRoutes = require('./modules/pipeline/pipeline.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const notesRoutes = require('./modules/notes/notes.routes');
const remindersRoutes = require('./modules/reminders/reminders.routes');
const whatsappRoutes = require('./modules/webhooks/whatsapp.routes');
const whatsappApiRoutes = require('./modules/webhooks/whatsapp.api.routes');
const widgetRoutes = require('./modules/widget/widget.routes');

const app = express();

// Security headers — relax CSP for the widget script so it can be embedded on third-party sites
app.use(helmet({
  contentSecurityPolicy: false, // widget embeds on arbitrary sites; set per-route if needed
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Serve the built widget JS file publicly
app.use('/widget', express.static(
  path.join(__dirname, '../../frontend/dist-widget'),
  { maxAge: '1d' }
));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', notesRoutes);
app.use('/api/leads', remindersRoutes);
app.use('/api/widget', widgetRoutes);
app.use('/api/whatsapp', whatsappApiRoutes);

// WhatsApp webhook (no /api prefix — Meta calls this directly)
app.use('/webhook', whatsappRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use(errorHandler);

module.exports = app;
