const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  weight: {
    type: Number
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerContact: {
    type: String
  },
  petId: {
    type: String,
    unique: true,
    required: true
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  lastCheckupDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema); 