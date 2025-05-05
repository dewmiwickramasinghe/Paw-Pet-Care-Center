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

// MongoDB URIs
const userDB_URI = process.env.USER_DB_URI || "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/test";
const petDB_URI = process.env.PET_DB_URI || "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/pets";

// Connect user DB
mongoose.connect(userDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to User DB"))
  .catch(err => console.error("❌ User DB Error:", err));

// Create pet DB connection
const petDBConnection = mongoose.createConnection(petDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Listen for petDB connection
petDBConnection.once('open', () => console.log("✅ Connected to Pet DB"));
petDBConnection.on('error', (err) => console.error("❌ Pet DB Error:", err));

// Attach connections to request
app.use((req, res, next) => {
    req.userDB = mongoose.connection.useDb('test');  // Use test DB (not 'userDB', it's 'test')
    req.petDB = petDBConnection;
    next();
});

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
