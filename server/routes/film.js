const express = require('express');
const router = express.Router();
const { uploadFilm, getFilms, getUserFilms, uploadToS3, uploadThumbnailToS3, deleteFilm, getFilmById, voteFilm, getVotes, getFeed, getTopTenFilms, getTopTenFilmsByGenre, getFilmsByGenre, viewFilm, getSeriesByFilmId, updateFilm } = require('../controllers/filmController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes
router.post('/upload-to-s3', auth, upload.single('file'), uploadToS3); // Upload file to S3
router.post('/upload-thumbnail-to-s3', auth, upload.single('thumbnail'), uploadThumbnailToS3) // Upload thumbnail to S3
router.post('/upload', auth, uploadFilm);
router.get('/', getFilms);
router.get('/feed', auth, getFeed);
router.get('/top-films', getTopTenFilms);
router.get('/top-films-by-genre', getTopTenFilmsByGenre);
router.get('/:id', getFilmById);
router.get('/genre/:genre', getFilmsByGenre);
router.get('/user/:userId', getUserFilms);
router.delete('/delete/:filmId', auth, deleteFilm);
router.put('/update/:filmId', updateFilm);
router.post('/:filmId/vote', auth, voteFilm);
router.get('/:filmId/votes', auth, getVotes);
router.put('/:filmId/view', viewFilm);
router.get('/:filmId/series', getSeriesByFilmId);

module.exports = router;
