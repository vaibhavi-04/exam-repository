const express = require('express');
const QuestionPaper = require('../models/QuestionPaper');
const router = express.Router();

// Search by keyword
router.get('/', async (req, res) => {
  console.log('searching...');
  try {
    const { query } = req.query;
    const results = await QuestionPaper.find({ extractedText: { $regex: query, $options: 'i' } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
});

module.exports = router;
