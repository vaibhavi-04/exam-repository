const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure this exists
const mongoose = require("mongoose");
const Course = require("../models/Course");


const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  console.log("In authRoutes: signup");
  const { name, email, password, admissionNumber, semester, branch, currentCourses } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      admissionNumber,
      semester,
      // passingYear,
      branch,
      currentCourses, // Now an array of Course ObjectIds
    });

    await user.save();
  

    // Enroll student into selected courses safely
    await Promise.all(
        currentCourses.map(async (courseId) => {
          await Course.findByIdAndUpdate(courseId, {
            $addToSet: { studentsEnrolled: user._id }
        });
        })
    );
    

res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("currentCourses");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Profile Route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("In profile route");
    const user = await User.findById(req.user).select("-password").populate("currentCourses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
