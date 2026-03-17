const cron = require('node-cron');
const db = require('../config/database');
const { getIO } = require('../config/socket');

const reminderJob = {
  start() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const io = getIO();
        const now = new Date().toISOString();

        const dueReminders = await db('reminders')
          .join('leads', 'reminders.lead_id', 'leads.id')
          .where('reminders.due_at', '<=', now)
          .where('reminders.is_done', false)
          .where('reminders.notified', false)
          .select(
            'reminders.*',
            'leads.name as lead_name',
            'leads.phone as lead_phone'
          );

        for (const reminder of dueReminders) {
          // Emit to the specific user's room
          io.to(`user:${reminder.user_id}`).emit('reminder:due', {
            reminder,
            lead: { id: reminder.lead_id, name: reminder.lead_name, phone: reminder.lead_phone },
          });

          // Mark as notified
          await db('reminders').where('id', reminder.id).update({ notified: true });
        }
      } catch (err) {
        // Socket may not be initialized yet on startup
        if (!err.message?.includes('Socket.io not initialized')) {
          console.error('Reminder job error:', err.message);
        }
      }
    });

    console.log('Reminder job started (runs every minute)');
  },
};

module.exports = reminderJob;
