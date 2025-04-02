const User = require("../Model/UserModel");
const bcrypt = require('bcryptjs'); // For password hashing

// Get all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
};

// Add a new user
const addUsers = async (req, res, next) => {
    const { name, email, phoneNumber, address, username, password, confirmPassword } = req.body;

    // Check if the user already exists based on the email
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error checking existing user", error: err.message });
    }

    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    try {
        user = new User({ name, email, phoneNumber, address, username, password: hashedPassword, confirmPassword });
        await user.save();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to add user", error: err.message });
    }

    return res.status(201).json({ user });
};

// Get a user by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// Update user details
const UpdateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, phoneNumber, address, username, password, confirmPassword } = req.body;

    let user;

    try {
        // Hash the password if it's being updated
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Update the user
        user = await User.findByIdAndUpdate(id, { name, email, phoneNumber, address, username, password: hashedPassword || password, confirmPassword }, { new: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to update user", error: err.message });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// Delete user details
const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;

    try {
        // Handle deletion and check if the user was found
        user = await User.findByIdAndDelete(id);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to delete user", error: err.message });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully", user });
};

// Function to remove duplicate users based on email
const removeDuplicateUsers = async (req, res, next) => {
    try {
        // Step 1: Find duplicates based on the 'email' field
        const users = await User.aggregate([
            {
                $group: {
                    _id: "$email",  // Group by 'email' field
                    uniqueIds: { $addToSet: "$_id" },  // Collect user IDs for each email
                    count: { $sum: 1 }  // Count how many duplicates
                }
            },
            {
                $match: {
                    count: { $gt: 1 }  // Only select groups with more than 1 user (duplicates)
                }
            }
        ]);

        // Step 2: Loop through and delete all but one of the duplicate users
        for (let group of users) {
            group.uniqueIds.shift();  // Keep the first user
            await User.deleteMany({ _id: { $in: group.uniqueIds } });  // Delete the rest (duplicates)
        }

        // Send a success response
        return res.status(200).json({ message: "Duplicates removed successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error while removing duplicates", error: err.message });
    }
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.UpdateUser = UpdateUser;
exports.deleteUser = deleteUser;
exports.removeDuplicateUsers = removeDuplicateUsers;
