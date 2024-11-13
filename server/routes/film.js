const express = require('express');
const router = express.Router();
const { uploadFilm, getFilms, getUserFilms } = require('../controllers/filmController');
const auth = require('../middleware/authMiddleware');

router.post('/upload', auth, uploadFilm);
router.get('/', getFilms);
router.get('/user/:userId', getUserFilms)

module.exports = router;
