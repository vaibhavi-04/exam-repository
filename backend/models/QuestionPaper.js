const mongoose = require('mongoose');

const QuestionPaperSchema = new mongoose.Schema({
  filename: String,
  url: String,  // Cloudinary URL
  // subject: String,
  year: String,
  department: String,
  // semester: String,
  extractedText: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["midsem", "endsem", "quiz-1", "quiz-2", "other"], // Allowed options
    required: true,
  },
});

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);
