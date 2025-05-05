const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userDBConnection = mongoose.createConnection(
    "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid phone number with 10 digits']
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    confirmPassword: {
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

// Pre-save hook to hash password before saving it in the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 10);  // Hash the password
    this.confirmPassword = undefined;  // You don't need to store confirmPassword
    next();
});

// Compare password method (for login validation)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = userDBConnection.model("UserModel", userSchema);
