// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware"); // Ensure you have this
// const User = require("../models/User"); // Import your User model


// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     console.log('in profile route')
//     const user = await User.findById(req.user.id).select("-password"); // Exclude password
//     if (!user) return res.status(404).json({ message: "User not found" });
    
//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
