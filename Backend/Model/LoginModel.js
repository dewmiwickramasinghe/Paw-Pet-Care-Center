// Models/Login.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const loginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

loginSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password before saving
  }
  next();
});

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;
