const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const mongoose = require('mongoose'); 
require('dotenv').config();
const Film = require('./models/Film');

// Set ffmpeg-static as the path for fluent-ffmpeg
ffmpeg.setFfmpegPath('C:\\ffmpeg-2024-12-26-git-fe04b93afa-full_build\\bin\\ffmpeg.exe');

// Connect to your database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

async function updateFilmDuration() {
  try {
    // Fetch all films from the database
    const films = await Film.find();

    if (films.length === 0) {
      console.log('No films found in the database.');
      return;
    }

    // Iterate over each film and update the duration
    for (const film of films) {
      
      ffmpeg.ffprobe(film.filmUrl, (err, metadata) => {
        if (err) {
          console.error(`Error reading video metadata for film "${film.title}":`, err);
          return;
        }

        const duration = metadata.format.duration; // Duration in seconds
        console.log(`Updating duration for ${film.title}: ${duration} seconds`);

        // Update the film's duration in the database
        Film.findByIdAndUpdate(film._id, { duration }, { new: true })
          .then(() => console.log(`Updated film "${film.title}" with duration ${duration} seconds`))
          .catch((err) => console.error('Error saving film duration:', err));
      });
    }
  } catch (err) {
    console.error('Error during the update process:', err);
  }
}

// Trigger the function
updateFilmDuration();
