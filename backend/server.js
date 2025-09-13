const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");
const courseRoutes = require("./routes/courseRoutes");
const questionPaperRoutes = require("./routes/questionpaperRoutes");
const filterSearchRoutes = require("./routes/filterSearchRoutes");

// const { initSocket } = require("./sockets/socketHandler");

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
// initSocket(server);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Adjust origin for production

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

  // mongoose.set('debug', true);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/questionPapers", questionPaperRoutes);
app.use("/api/filter", filterSearchRoutes);

const PORT = process.env.PORT || 5000;

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found", path: req.originalUrl });
});


server.listen(PORT, () => 
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
);

