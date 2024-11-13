const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  films: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }], // Link videos to this series
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Series', seriesSchema);
