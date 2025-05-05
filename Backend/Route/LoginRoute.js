const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');  // User registration model

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

        // Logging for debugging
        console.log("User found:", user);

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch); // Add logging here to check if it compares correctly

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "your_jwt_secret",  // Ensure this is from .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
