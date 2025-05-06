const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  petname: { type: String, required: true },
  pettype: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  breed: { type: String, required: true },
  colour: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Correct field for owner/user
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
