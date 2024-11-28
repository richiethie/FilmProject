const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user; // Assuming user is authenticated
        const notifications = await Notification.find({ user: userId })
            .populate({
                path: 'initiator',
                select: 'username profilePhotoUrl', // Populate necessary fields for initiator
            })
            .populate({
                path: 'film',
                select: 'thumbnailUrl title', // Populate necessary fields for film
            })
            .sort({ createdAt: -1 });
            
        res.json(notifications); // Return notifications including all required fields
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};
