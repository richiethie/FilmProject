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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
// Enable CORS for all origins or specify frontend URL
const corsOptions = {
  origin: 'https://filmshare.vercel.app/', // Adjust this based on where your frontend is hosted
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/series', seriesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
