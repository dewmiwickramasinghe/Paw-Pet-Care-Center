const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const userRouter = require("./Route/UserRoute");
const petRouter = require("./Route/PetRoute");
const authRouter = require("./Route/authRout");  // Import the new auth route

// Initialize app
const app = express();

// Middleware to parse JSON and handle file uploads
app.use(express.json());             // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // For URL-encoded bodies
app.use(cors());                     // Enable Cross-Origin Resource Sharing

// MongoDB URIs from environment variables
const userDB_URI = process.env.USER_DB_URI || "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/test";
const petDB_URI = process.env.PET_DB_URI || "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/pets";

// Connect to MongoDB (Corrected Databases)
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,  // Increased timeout to 60 seconds
    connectTimeoutMS: 60000,          // 60 seconds timeout for connection
    socketTimeoutMS: 60000           // 60 seconds socket timeout
};

// Connect to the user database
mongoose.connect(userDB_URI, mongooseOptions)
    .then(() => console.log("✅ Connected to User DB (Test DB)"))
    .catch(err => console.error("❌ User DB Connection Error:", err));

// Create a separate connection for the pet database
const petDBConnection = mongoose.createConnection(petDB_URI, mongooseOptions);

// Check if the variable is already declared before declaring it again
if (!mongoose.connection.readyState) {
    // Create a separate connection for the pet database if it's not already declared
    const petDBConnection = mongoose.createConnection(petDB_URI, mongooseOptions);

    // Listen for successful connection to pet database
    petDBConnection.once('open', () => {
        console.log("✅ Connected to Pet DB (petDB)");
    });

    // Handle connection errors for the pet database
    petDBConnection.on('error', (err) => {
        console.error("❌ Pet DB Connection Error:", err);
    });
} else {
    console.log("Pet DB connection already established.");
}

// Attach mongoose connections to request object
app.use((req, res, next) => {
    req.userDB = mongoose.connection.useDb('userDB');  // for the user DB
    req.petDB = mongoose.connection.useDb('petDB');    // for the pet DB
    next();
});

// **Login Logic (Newly Added)**

// Authentication middleware for login route
app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password." });
    }

    try {
        // Find user by username in the database
        const user = await req.userDB.collection("users").findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

        // Send token in response
        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Define routes for users, pets, and authentication
app.use("/users", userRouter); // Handles user operations
app.use("/pets", petRouter);   // Handles pet operations
app.use("/auth", authRouter);  // Handles login

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
