const AWS = require('aws-sdk');
const Film = require('../models/Film');
const { v4: uuidv4 } = require('uuid');

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

// Fetch films for a specific user
exports.getUserFilms = async (req, res) => {
  try {
    const { userId } = req.params;

    const films = await Film.find({ uploadedBy: userId }).populate('uploadedBy', 'username email');
    
    if (films.length === 0) {
      return res.status(404).json({ message: 'No films found for this user.' });
    }

    res.status(200).json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
