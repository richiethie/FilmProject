const Film = require('../models/Film');
const Comment = require('../models/Comment');
const User = require('../models/User');
const {createNotification} = require('../utils/notifications');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ film: req.params.filmId }).populate('user', 'username');
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user; // Assume req.user contains the authenticated user's ID
        const filmId = req.params.filmId;

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        // Find the film
        const film = await Film.findById(filmId).populate('uploadedBy');
        if (!film) {
            return res.status(404).json({ message: 'Film not found' });
        }

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create and save the new comment
        const newComment = new Comment({
            text,
            user: { _id: user._id, username: user.username }, // Always include _id and username
            film: filmId,
        });

        await newComment.save();

        // Create notification for the film owner (the user who uploaded the film)
        const filmOwnerId = film.uploadedBy._id; // Assuming `film.user` contains the owner of the film
        const commentText = newComment.text
        // if (filmOwnerId.toString() !== userId.toString()) { // Don't notify the commenter themselves
        await createNotification('Comment', filmOwnerId, userId, filmId, commentText);
        //}

        // Populate the user field for the response
        const populatedComment = await Comment.findById(newComment._id).populate('user', 'username _id');

        res.status(201).json(populatedComment); // Return the newly created comment with populated user details
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCommentCount = async (req, res) => {
    try {
        const comments = await Comment.find({ film: req.params.filmId }).populate('user', 'username');
        const commentCount = comments.length
        res.json(commentCount);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};