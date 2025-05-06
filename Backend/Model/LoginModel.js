const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Login history schema definition
const loginHistorySchema = new Schema({
  username: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    required: true
  }
});

// Create the Login model
module.exports = mongoose.model('LoginModel', loginHistorySchema);
