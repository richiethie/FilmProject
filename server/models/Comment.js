const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true },
    },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
