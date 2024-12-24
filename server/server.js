require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const filmRoutes = require('./routes/film');
const notificationRoutes = require('./routes/notificationRoutes');
const commentRoutes = require('./routes/commentRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const searchRoutes = require('./routes/searchRoutes');

const cron = require('node-cron');
const { updateTopCreator } = require('./utils/updateTopCreator');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
// Enable CORS for all origins or specify frontend URL
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Adjust this based on where your frontend is hosted
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/search', searchRoutes);

cron.schedule('20 6 * * 2', updateTopCreator, {
  scheduled: true,
  timezone: 'UTC', // Set the desired timezone if necessary
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
