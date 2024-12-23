const Film = require('../models/Film');
const Series = require('../models/Series');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.handleSearch = async (req, res) => {
    console.log("Search Route Hit!");
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });

    try {
        // Find users by username
        const users = await User.find({ username: { $regex: q, $options: 'i' } });

        // Collect the IDs of the matching users
        const userIds = users.map(user => user._id);

        // Find films by title or uploadedBy's ID
        const films = await Film.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { uploadedBy: { $in: userIds } }
            ]
        }).populate('uploadedBy', 'username _id'); // Ensure 'uploadedBy' is populated

        // Find series by title and populate films
        const series = await Series.find({ title: { $regex: q, $options: 'i' } })
            .populate('films') // Populate the 'films' field in each series
            .exec();

        res.json({ users, films, series });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

