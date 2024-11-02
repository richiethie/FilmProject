const express = require('express');
const router = express.Router();

// Sample route
router.get('/', (req, res) => {
  res.send('Video route is working!');
});

module.exports = router;
