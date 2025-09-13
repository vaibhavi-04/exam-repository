const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  semester: { type: String },
  // passingYear: { type: String },
  branch: { type: String },
  // currentCourses: { type: [String] },
  currentCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  credits: { type: Number, default: 20 }, // Start with 20 credits
});

module.exports = mongoose.model("User", userSchema);
