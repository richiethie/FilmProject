const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addSeries, getUserSeries, getSeriesById } = require('../controllers/seriesController');

router.post('/add', auth, addSeries);
router.get('/:seriesId', getSeriesById);
router.get('/user/:userId', auth, getUserSeries);

module.exports = router;