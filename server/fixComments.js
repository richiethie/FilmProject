const mongoose = require('mongoose');
require('dotenv').config();
const Comment = require('./models/Comment'); // Adjust the path to your Comment model

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('MONGO_URI is not set in .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Delete all comments in the collection
      const result = await Comment.deleteMany({});
      console.log(`Deleted ${result.deletedCount} comments.`); // Log how many comments were deleted
    } catch (error) {
      console.error('Error deleting comments:', error);
    } finally {
      // Close the MongoDB connection
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
