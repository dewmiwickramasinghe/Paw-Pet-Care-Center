const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel'); // Your User model

const router = express.Router();

// POST /auth/login - Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Get username and password from the body

    try {
        // Step 1: Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Step 2: Compare entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Step 3: Create and send back a JWT token (authentication)
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
