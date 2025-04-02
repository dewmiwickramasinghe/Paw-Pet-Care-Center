// Route/authRout.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = require('../Model/LoginModel'); // Assuming Login model here

const router = express.Router();

// POST /login - Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find login details by username
    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, // Use the secret from .env
      { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    // Respond with the JWT token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
