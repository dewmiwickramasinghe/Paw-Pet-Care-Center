const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routers
const userRouter = require("./Route/UserRoute");
const petRouter = require("./Route/PetRoute");
const authRouter = require("./Route/authRout");  // Import the auth.js file

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to local MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/PETCARE";
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to Local MongoDB at PETCARE"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/users", userRouter);
app.use("/pets", petRouter);
app.use("/auth", authRouter);  // Use the authRouter to protect routes

// 404 handler - must be after all routes
app.use((req, res, next) => {
  res.status(404).json({ statusCode: 404, error: "Not Found" });
});

// Error handler middleware - must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    statusCode: err.status || 500,
    error: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
