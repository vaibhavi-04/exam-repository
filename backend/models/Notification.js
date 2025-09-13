const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  questionPaperId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionPaper", default: null },
  questionPaperUrl: { type: String, default: null }, // ✅ Added URL field
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
