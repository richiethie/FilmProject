const express = require('express');
const router = express.Router();
const { uploadFilm, getFilms, getUserFilms, uploadToS3, uploadThumbnailToS3 } = require('../controllers/filmController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes
router.post('/upload-to-s3', auth, upload.single('file'), uploadToS3); // Upload file to S3
router.post('/upload-thumbnail-to-s3', auth, upload.single('thumbnail'), uploadThumbnailToS3) // Upload thumbnail to S3
router.post('/upload', auth, uploadFilm);
router.get('/', getFilms);
router.get('/user/:userId', getUserFilms);

module.exports = router;
