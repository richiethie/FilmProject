const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: false },
    commentText: { type: String, required: false },  // Add the comment text
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  
