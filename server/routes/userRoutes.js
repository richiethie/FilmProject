const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Route to get a list of all users
router.get('/', async (req, res) => {
  try {
    // Find all users from the database
    const users = await User.find(); // This returns all users
    res.status(200).json(users); // Return the list of users as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
});

module.exports = router;
