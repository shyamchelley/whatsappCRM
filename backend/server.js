require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/config/socket');
const reminderJob = require('./src/jobs/reminderJob');
const { initWhatsApp } = require('./src/modules/webhooks/whatsapp.client');

const PORT = process.env.PORT || 3001;

const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Start reminder cron job
reminderJob.start();

httpServer.listen(PORT, () => {
  console.log(`CRM Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize WhatsApp client after server is up (so Socket.io is ready)
  initWhatsApp();
});

module.exports = httpServer;
