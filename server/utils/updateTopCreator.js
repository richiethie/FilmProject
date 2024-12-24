// File: helpers/updateTopCreator.js
const mongoose = require('mongoose');
const Film = require('../models/Film');
const User = require('../models/User');

exports.updateTopCreator = async () => {
    try {
        const topFilms = await Film.find()
        .sort({ rank: -1 })
        .limit(10);

        const topCreatorUserIds = new Set();
        
        topFilms.forEach(film => {
        if (film.uploadedBy) {
            console.log(film.user)
            topCreatorUserIds.add(film.uploadedBy);
        }
        });
    
        const usersUpdated = await User.updateMany(
            { _id: { $in: Array.from(topCreatorUserIds) } },
            { $set: { topCreator: true } }
        );
        console.log('Users Updated:', usersUpdated);
    } catch (error) {
        console.error('Error updating top creators:', error);
    }
}

