const express = require("express");
const { getUserNotifications, markNotificationRead } = require("../controllers/notificationController");
// const verifyToken = require("../middleware/authMiddleware"); // Ensure user is logged in
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.patch("/:id/mark-read", authMiddleware, markNotificationRead);

module.exports = router;
