const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const { uploadProfilePictureToS3, updateUserProfile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

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

// Route to get a specific user by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters
  try {
    const user = await User.findById(userId); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // If user is not found
    }
    res.status(200).json(user); // Return the user as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
});

//Upload Profile Pic to S3 Bucket
router.post('/upload-profile-picture-to-s3', auth, upload.single('profilePicture'), uploadProfilePictureToS3)

//Update User profile
router.put('/:userId', auth, updateUserProfile);

//Follow
router.post('/:userId/follow', async (req, res) => {
  const currentUserId = req.user._id; // assuming user is authenticated
  const userToFollowId = req.params.userId;

  if (currentUserId === userToFollowId) {
    return res.status(400).send('You cannot follow yourself');
  }

  try {
    // Add userToFollowId to current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userToFollowId }
    });

    // Add currentUserId to the followed user's followers list
    await User.findByIdAndUpdate(userToFollowId, {
      $addToSet: { followers: currentUserId }
    });

    res.status(200).send('Followed successfully');
  } catch (err) {
    res.status(500).send('Error following user');
  }
});

module.exports = router;
