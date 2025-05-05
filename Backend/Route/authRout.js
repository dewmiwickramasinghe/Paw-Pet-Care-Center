const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');  // Commented out since not used now
const User = require('../Model/UserModel');
const Login = require('../Model/LoginModel');

const router = express.Router();

// 📧 Configure nodemailer transporter (commented out)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// ✅ Check if transporter is ready to send emails (commented out)
// transporter.verify((error, success) => {
//   if (error) {
//     console.log('❌ Email server error:', error);
//   } else {
//     console.log('✅ Email server is ready to send emails');
//   }
// });

// 🚪 Login route
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

    await Login.create({ username: username, loginTime: new Date() });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      userName: user.username,
      userRole: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 Forgot password route (commented out)
// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
//     }

//     const resetToken = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || 'your_jwt_secret',
//       { expiresIn: '1h' }
//     );

//     const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset Request',
//       html: `
//         <p>You requested a password reset.</p>
//         <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
//         <p>If you did not request this, please ignore this email.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(`✅ Sent password reset email to ${email} with link: ${resetUrl}`);

//     res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
//   } catch (error) {
//     console.error('❌ Forgot password error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;
