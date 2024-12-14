require('dotenv').config();
const mongoose = require('mongoose');
const Film = require('./models/Film'); // Path to your Film model

async function updateFilmSeries() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Update films where series is a string and transform it to an ObjectId
    const result = await Film.updateMany(
      { series: { $type: 'string' } }, // Match films where series is a string
      {
        $set: {
          series: { $toObjectId: '$series' }, // Convert string series to ObjectId
        },
      }
    );

    console.log('Updated films:', result.modifiedCount);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating films:', error);
    mongoose.disconnect();
  }
}

updateFilmSeries();

