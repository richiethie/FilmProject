const Notification = require('../models/Notification');

const createNotification = async (type, userId, initiatorId, filmId = null, commentText = null) => {
    try {
      if (!userId || !initiatorId) {
        throw new Error('Invalid user or initiator ID');
      }
  
      const notification = new Notification({
        user: userId,
        type,
        initiator: initiatorId,
        film: filmId || null,
        commentText: commentText || null, // Store the comment text if available
        createdAt: new Date(),
      });
  
      await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Notification creation failed');
    }
};
  

module.exports = { createNotification };
