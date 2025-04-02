const mongoose = require("mongoose");
const userDBConnection = mongoose.createConnection(
    "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/", 
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Schema = mongoose.Schema;

// User schema definition with the desired fields in the provided order
const userSchema = new Schema({
    name: {  // Full name
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {  // Email address
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phoneNumber: {  // Phone number
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid phone number with 10 digits']
    },
    address: {  // Address
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    username: {  // Username
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {  // Password
        type: String,
        required: true,
        minlength: 6
    },
    confirmPassword: {  // Confirm password
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    pets: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PetModel'  // Reference to the PetModel
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model using the userDBConnection
module.exports = userDBConnection.model("UserModel", userSchema);
