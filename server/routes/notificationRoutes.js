const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getNotifications } = require('../controllers/notificationController');

// Get notifications for the current user
router.get('/', auth, getNotifications);

module.exports = router;