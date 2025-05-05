const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');  // Correct path
const Login = require('../Model/LoginModel');  // Correct path

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// POST /auth/login - User login and token generation
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Save login history (LoginModel setup needed)
    await Login.create({ username: username, loginTime: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: '1h' }
    );

    // Respond with token
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example of a protected route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  // Access user ID from decoded token
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
