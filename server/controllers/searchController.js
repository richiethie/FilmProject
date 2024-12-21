const Film = require('../models/Film');
const Series = require('../models/Series');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.handleSearch = async (req, res) => {
    console.log("Search Route Hit!")
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });
  
    try {
      const users = await User.find({ username: { $regex: q, $options: 'i' } });
      const films = await Film.find({ title: { $regex: q, $options: 'i' } })
            .populate('uploadedBy', 'username _id');;
      const series = await Series.find({ title: { $regex: q, $options: 'i' } })
            .populate('films') // Populate the 'films' field in each series
            .exec();
  
      res.json({ users, films, series });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};