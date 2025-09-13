const express = require("express");
const router = express.Router();
const QuestionPaper = require("../models/QuestionPaper");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure token validation
const axios = require("axios"); // ✅ Import axios

// ✅ Route to get question papers based on user's enrolled courses
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user;

    // Find the user and get their enrolled courses
    const user = await User.findById(userId).populate("currentCourses");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get course IDs the user is enrolled in
    const enrolledCourseIds = user.currentCourses.map(course => course._id);

    // Find question papers matching enrolled courses
    const questionPapers = await QuestionPaper.find({ courseId: { $in: enrolledCourseIds } }).populate("courseId");

    res.json(questionPapers);
  } catch (error) {
    console.error("Error fetching question papers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    // ✅ Fetch user with credits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check credits before proceeding
    if (user.credits < 5) {
      return res.status(400).json({ message: "Not enough credits to download!" });
    }

    const paperId = req.params.id;

    if (!paperId) {
      return res.status(400).json({ message: "Paper ID is missing" });
    }

    // ✅ Fetch question paper
    const paper = await QuestionPaper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Question Paper not found" });
    }

    if (!paper.url) {
      return res.status(400).json({ message: "File URL is missing" });
    }

    console.log("Downloading file from URL:", paper.url);

    // ✅ Deduct credits after confirming the paper exists
    user.credits -= 5;
    await user.save();

    // ✅ Fetch file from Cloudinary
    const response = await axios.get(paper.url, { responseType: "arraybuffer" });

    const fileExtension = ".pdf"; // Assuming PDFs
    const fileName = `${paper.year}_${paper.type || "QuestionPaper"}${fileExtension}`;

    res.set({
      "Content-Type": response.headers["content-type"] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    res.send(response.data);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Failed to download file", error: error.message });
  }
});







module.exports = router;
