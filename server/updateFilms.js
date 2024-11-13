require('dotenv').config();
const mongoose = require('mongoose');
const Film = require('./models/Film'); // Path to your Film model

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return Film.updateMany({}, { $set: { rank: null } }); // Set rank to null for all films
  })
  .then(result => {
    console.log('Updated films:', result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
