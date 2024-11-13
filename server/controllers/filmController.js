const Film = require('../models/Film');

exports.uploadFilm = async (req, res) => {
  const { title, description, thumbnailUrl, filmUrl, genre, series, visibility } = req.body;

  try {
    const newFilm = await Film.create({
      title,
      description,
      thumbnailUrl,
      filmUrl,
      genre,
      series,
      visibility,
      uploadedBy: req.user, // This comes from auth middleware
    });

    res.status(201).json(newFilm);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading film', error: err.message });
  }
};

exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find().populate('uploadedBy', 'username email');
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching films', error: err.message });
  }
};

exports.getUserFilms = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch films for the user from the database
    const films = await Film.find({ uploadedBy: userId }); // Assuming 'uploadedBy' field is the reference to the User model
    
    if (!films) {
      return res.status(404).json({ message: 'No films found for this user.' });
    }

    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};