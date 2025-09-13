const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/Cloudinary");
const Tesseract = require("tesseract.js");

const QuestionPaper = require("../models/QuestionPaper");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");
const { emitToUser } = require("../sockets/socketHandler");
const User = require('../models/User');

const router = express.Router();

// -----------------------------
// ✅ Multer + Cloudinary setup
// -----------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "question_papers",
    allowed_formats: ["pdf", "jpg", "png"],
  },
});

const upload = multer({ storage: storage });

// ✅ Allowed Types
const allowedTypes = ["midsem", "endsem", "quiz-1", "quiz-2", "other"];

// -----------------------------
// ✅ Upload Route
// -----------------------------
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { year, department, courseId, type } = req.body;
    const uploadedBy = req.user;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type selected." });
    }

    //check for duplicate questoin paper
    const existingPaper =await QuestionPaper.findOne({
      courseId,
      type,
      department,
      year,
    })

    if(existingPaper){
      return res.status(400).json({message: "Question Paper exists already :) "})
    }

    // -----------------------------
    // ✅ OCR extraction
    // -----------------------------
    const textData = await Tesseract.recognize(req.file.path, "eng");
    const extractedText = textData.data.text;

    // -----------------------------
    // ✅ Save Question Paper
    // -----------------------------
    const newPaper = new QuestionPaper({
      filename: req.file.filename,  // cloudinary public_id
      url: req.file.path,           // cloudinary secure url
      year,
      department,
      courseId,
      extractedText,
      uploadedBy,
      type,  // ✅ Save Type
    });

    
    await newPaper.save();

    // ✅ Increase User Credits on Successful Upload
    const user = await User.findById(uploadedBy);
    if (user) {
      user.credits += 20; // Add 20 credits for uploading
      await user.save();
    }


    // -----------------------------
    // ✅ Notify Enrolled Students
    // -----------------------------
    const course = await Course.findById(courseId).populate("studentsEnrolled");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const notifications = course.studentsEnrolled.map((user) => ({
      userId: user._id,
      message: `A new ${type} question paper has been uploaded for course: ${course.name}`,
      questionPaperId: newPaper._id,
      questionPaperUrl: newPaper.url,
      isRead: false,
    }));

    const savedNotifications = await Notification.insertMany(notifications);

    course.studentsEnrolled.forEach((user) => {
      emitToUser(user._id, "newNotification", {
        message: `A new ${type} question paper has been uploaded for your course.`,
        notificationId: savedNotifications.find(n => n.userId.toString() === user._id.toString())._id,
      });
    });

    // -----------------------------
    // ✅ Final Response
    // -----------------------------
    res.json({ message: "Upload successful, notifications sent.", data: newPaper });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
