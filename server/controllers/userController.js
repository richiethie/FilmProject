const User = require('../models/User')

exports.uploadProfilePictureToS3 = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No profile picture file uploaded.');
  }

  console.log('Profile Picture file uploaded:', req.file.location);

  // Return the URL of the uploaded thumbnail in S3
  return res.status(200).json({
    profilePictureUrl: req.file.location,
  });
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  const { username, bio, profilePhotoUrl } = req.body; // Get updated fields from request body
  console.log('Updated Profile:', { username, bio, profilePhotoUrl });

  try {
    // Find the user by ID and update the profile fields
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePhotoUrl) user.profilePhotoUrl = profilePhotoUrl;

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return the updated user data
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};