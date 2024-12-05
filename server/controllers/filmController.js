const AWS = require('aws-sdk');
const Film = require('../models/Film');
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { createNotification } = require('../utils/notifications');
const Notification = require('../models/Notification');

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload film handler (route logic for saving film details)
exports.uploadFilm = async (req, res) => {
  try {
    console.log("req.body:", req.body); // Check the metadata fields

    const { title, description, genre, series, filmUrl, thumbnailUrl, visibility, duration, rank, votes, uploadedBy } = req.body;

    // Validate required fields
    if (!title || !filmUrl || !uploadedBy) {
      return res.status(400).json({ message: 'Missing required fields: title, filmUrl, or uploadedBy.' });
    }

    // Create a new film entry
    const newFilm = new Film({
      title,
      description,
      genre,
      series,
      filmUrl,               // S3 URL of the uploaded film
      thumbnailUrl,          // Thumbnail URL
      visibility,            // Visibility setting
      duration,              // Duration in minutes
      rank: rank || 0,                  // Rank, if provided
      votes,                 // Votes, if provided
      uploadedBy,            // User who uploaded the film
    });

    // Save the film entry to the database
    await newFilm.save();

    // Return the newly created film
    res.status(201).json({
      message: 'Film uploaded successfully',
      film: newFilm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading film', error: err.message });
  }
};

exports.uploadToS3 = (req, res) => {
  // Check which file was uploaded
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Log the file details for debugging
  console.log(req.file);

  // Respond with the file URL
  return res.status(200).json({
    fileUrl: req.file.location, // URL of the uploaded file in S3
  });
};



exports.uploadThumbnailToS3 = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No thumbnail file uploaded.');
  }

  console.log('Thumbnail file uploaded:', req.file.location);

  // Return the URL of the uploaded thumbnail in S3
  return res.status(200).json({
    thumbnailUrl: req.file.location,
  });
};

// Fetch all films
exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find().populate('uploadedBy', 'username email');
    res.status(200).json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching films', error: err.message });
  }
};

exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Film ID' });
  }

  try {
      const film = await Film.findById(id).populate('uploadedBy', 'username');
      if (!film) {
          return res.status(404).json({ message: 'Film not found' });
      }
      res.json(film);
  } catch (error) {
      console.error('Error fetching film:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch films for a specific user
exports.getUserFilms = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID received in params:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const films = await Film.find({ uploadedBy: new mongoose.Types.ObjectId(userId) }).populate('uploadedBy', 'username');

    if (films.length === 0) {
      return res.status(404).json({ message: 'No films found for this user.' });
    }

    res.status(200).json(films);
  } catch (err) {
    console.error('Error fetching films:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteFilm = async (req, res) => {
  const { filmId } = req.params;
  console.log(req.params)

  try {
    // Find the film by ID
    const film = await Film.findById(filmId);

    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    // If film exists, delete the film file from S3 (optional, based on your use case)
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 Bucket name
      Key: film.filmUrl, // The path to the file in the S3 bucket
    };

    await s3.deleteObject(params).promise();

    // If film has a thumbnail, delete that from S3 as well
    if (film.thumbnailUrl) {
      const thumbnailParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: film.thumbnailUrl,
      };
      await s3.deleteObject(thumbnailParams).promise();
    }

    // Delete the film from the database
    await film.deleteOne();

    return res.status(200).json({ message: 'Film deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.voteFilm = async (req, res) => {
  try {
    const { filmId } = req.params;
    const userId = req.user; // Ensure `req.user.id` has the proper user ID
    const { isUpvote } = req.body; // Whether it's an upvote (true) or a downvote (false)

    // Fetch film details
    const film = await Film.findById(filmId).populate('uploadedBy'); // Populate the uploadedBy field to get the film owner
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    // Ensure votes field is initialized to an empty array if not present
    if (!Array.isArray(film.votes)) {
      film.votes = [];
    }

    // Check if the user has already voted
    const userHasVoted = film.votes.includes(userId);

    if (isUpvote) {
      // If the user is upvoting and hasn't voted yet, add their userId to the array
      if (!userHasVoted) {
        film.votes.push(userId);
      }

      // Create a notification for the film owner (uploadedBy)
      const filmOwnerId = film.uploadedBy._id; // Get the film owner's ID
      // Avoid sending a notification to the user who voted
      // if (filmOwnerId.toString() !== userId.toString()) {
        await createNotification('Vote', filmOwnerId, userId, filmId); // Notify the film owner about the vote
      //}
      
    } else {
      // If the user is removing their vote (downvoting), remove their userId from the array
      if (userHasVoted) {
        film.votes = film.votes.filter((vote) => vote !== userId);

        // Remove the notification related to this vote (if it exists)
        const notification = await Notification.findOne({
          type: 'Vote',
          user: film.uploadedBy._id, // The film owner
          initiator: userId, // The user who voted
          film: filmId, // The film ID
        });

        if (notification) {
          await Notification.deleteOne({ _id: notification._id }); // Delete the notification if found
        }
      }
    }

    // Save the updated film
    await film.save();

    // Respond with the updated votes count and whether the user has voted
    res.json({
      votes: film.votes.length, // The number of votes is the length of the array
      userHasVoted: film.votes.includes(userId), // Check if user has voted
    });
  } catch (err) {
    console.error('Error voting on film:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getVotes = async (req, res) => {
  try {
    const { filmId } = req.params;
    const userId = req.user; // Assuming `authMiddleware` attaches the user info to req.user
    
    // Fetch film details, ensure votes is initialized to an empty array
    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    // Ensure votes field is initialized to an empty array if not present
    if (!film.votes) {
      film.votes = [];
    }

    // Check if the user has voted
    const userHasVoted = film.votes.includes(userId); // Adjust based on how you store votes

    // Respond with votes count and user's vote status
    res.json({
      votes: film.votes.length, // Number of votes
      userHasVoted, // Boolean: whether the user has already upvoted
    });
  } catch (err) {
    console.error('Error fetching votes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user; // Assumes `authenticate` middleware attaches `user` to req
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch the current user and populate the 'following' field (assumes `following` is an array of ObjectIds)
    const currentUser = await User.findById(userId)
      .populate('following', 'username email _id') // Populate the `following` field with username, email, and _id
      .exec();

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the list of followed users' IDs, including the current user's ID
    const userIdsToFetch = [
      ...currentUser.following.map((user) => user._id), // IDs of users the current user is following
      userId // Include the current user's own ID for their films
    ];
    // Fetch public and unlisted films from the followed users and the current user
    const films = await Film.find({
      uploadedBy: { $in: userIdsToFetch }, // Match films uploaded by followed users or the current user
      visibility: { $in: ['public', 'unlisted', 'private'] }, // Optionally filter by visibility
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('uploadedBy', 'username _id') // Populate `uploadedBy` field with username and email
      .lean(); // Use lean to return plain JavaScript objects (faster)

    res.status(200).json(films);
  } catch (err) {
    console.error('Error fetching feed films:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTopTenFilms = async (req, res) => {
  try {
    const topFilms = await Film.aggregate([
      // Match only public films
      //{ $match: { visibility: 'public' } },
      // Add a field to calculate the number of votes
      {
        $addFields: {
          voteCount: { $size: "$votes" },
        },
      },
      // Sort by the number of votes in descending order
      { $sort: { voteCount: -1 } },
      // Limit to top 10 films
      { $limit: 10 },
    ]);

    // Populate the `uploadedBy` field for additional user details
    const populatedTopFilms = await Film.populate(topFilms, {
      path: 'uploadedBy',
      select: 'username', // Only include the `username` field from the User document
    });

    res.json(populatedTopFilms);
  } catch (error) {
    console.error("Error fetching top films:", error);
    res.status(500).json({ error: 'Failed to fetch top films' });
  }
};