const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const { uploadProfilePictureToS3, updateUserProfile } = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');
const Follow = require('../models/Follow');
const { createNotification } = require('../utils/notifications');

// Route to get a list of all users
router.get('/', auth, async (req, res) => {
  const currentUserId = req.user; // Extract the current user ID from the authentication middleware
  
  try {
    // Find all users excluding the current user
    const users = await User.find({ _id: { $ne: currentUserId } }); // Exclude current user by ID
    
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
router.post('/:userId/follow', auth, async (req, res) => {
  const currentUserId = req.user; // assuming user is authenticated
  const userToFollowId = req.params.userId;

  if (currentUserId === userToFollowId) {
    return res.status(400).send('You cannot follow yourself');
  }

  try {
    // Add userToFollowId to current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userToFollowId },
      $inc: { followingCount: 1 }
    });

    // Add currentUserId to the followed user's followers list
    await User.findByIdAndUpdate(userToFollowId, {
      $addToSet: { followers: currentUserId },
      $inc: { followersCount: 1 }
    });

    await createNotification('Follow', userToFollowId, currentUserId);

    res.status(200).send('Followed successfully');
  } catch (err) {
    res.status(500).send('Error following user');
  }
});

router.post('/:userId/unfollow', auth, async (req, res) => {
  const currentUserId = req.user; // assuming user is authenticated
  const userToUnfollowId = req.params.userId;

  try {
    // Remove userToUnfollowId from current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userToUnfollowId },
      $inc: { followingCount: -1 }
    });

    // Remove currentUserId from the followed user's followers list
    await User.findByIdAndUpdate(userToUnfollowId, {
      $pull: { followers: currentUserId },
      $inc: { followersCount: -1 }
    });

    res.status(200).send('Unfollowed successfully');
  } catch (err) {
    res.status(500).send('Error unfollowing user');
  }
});

// Check for if a User is already following
router.get('/:userId/is-following', auth, async (req, res) => {
  const currentUserId = req.user; // Assuming user info is attached via authentication middleware
  const userIdToCheck = req.params.userId; // The user whose follow status we are checking
  
  try {
    // Check if the currentUserId is in the following array of the user we're checking
    const user = await User.findById(userIdToCheck); // Find the user to check
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the currentUserId is in the following list of the user
    const isFollowing = user.followers.includes(currentUserId);
    
    // Send the response back indicating follow status
    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
