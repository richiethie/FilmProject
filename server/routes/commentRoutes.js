const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getComments, addComment, getCommentCount } = require('../controllers/commentController');

// Route to get all comments for a specific film
router.get('/film/:filmId', getComments)

router.get('/film/:filmId/count', getCommentCount)

// Route to add a comment
router.post('/film/:filmId', auth, addComment)
  
module.exports = router;