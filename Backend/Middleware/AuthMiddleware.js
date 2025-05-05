// Backend/Middleware/AuthMiddleware.js

const jwt = require('jsonwebtoken');

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // 👈 Use same secret as in login
    req.user = decoded; // Attach decoded user to request
    next(); // Continue
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token.' });
  }
};
