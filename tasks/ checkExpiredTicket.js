const cron = require('node-cron');
const UserTickets = require('../models/UserTickets');

// Step 2: Define a Mongoose model for 'UserTickets' collection (if not already defined)

// Your existing 'findExpiredTicket' cron job
const checkExpiredTickets = cron.schedule(
  '0 0 * * *',
  async () => {
    try {
      const today = new Date();
      // Use updateMany to update unuse tickets that are older than today
      const updateResult = await UserTickets.updateMany(
        {
          status: 'unuse',
          ticketDate: { $lt: today },
        },
        {
          $set: { status: 'expired', statusDate: today },
        }
      );

      console.log(updateResult);
    } catch (error) {
      console.error('Error while updating unuse tickets:', error);
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Taipei',
  }
);

module.exports = checkExpiredTickets;
