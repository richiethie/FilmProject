const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { handleSearch } = require('../controllers/searchController');

router.get('/', handleSearch);

module.exports = router;