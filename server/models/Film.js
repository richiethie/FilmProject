const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnailUrl: { type: String, required: true },
  filmUrl: { type: String, required: true }, // URL or path to the film file
  genre: { type: String },
  series: { type: String },
  duration: { type: Number }, // Duration in minutes
  rank: { type: Number, default: null },
  votes: { type: Number, default: 0 },
  visibility: {
    type: String,
    enum: ['private', 'unlisted', 'public'],
    default: 'private',
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Film', filmSchema);
