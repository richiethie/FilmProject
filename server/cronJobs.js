const cron = require('node-cron');
const { updateTopCreator } = require('./utils/updateTopCreator');

// Schedule the task to run every hour
cron.schedule('0 0 * * 0', updateTopCreator, {
  scheduled: true,
  timezone: 'UTC', // Set the desired timezone if necessary
});

