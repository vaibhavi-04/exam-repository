const express = require("express");
const QuestionPaper = require("../models/QuestionPaper");

const router = express.Router();

// ✅ Get Question Papers with Filters
router.get("/search", async (req, res) => {
  try {
    const { courseId, year, type } = req.query;

    let filter = {};

    if (courseId) filter.courseId = courseId;
    if (year) filter.year = year;
    if (type) filter.type = type;

    const papers = await QuestionPaper.find(filter).populate("courseId");
    res.json(papers);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

module.exports = router;
