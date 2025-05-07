const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['vaccination', 'deworming', 'checkup', 'surgery', 'grooming', 'medication', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  performedBy: {
    type: String,
    default: ''
  },
  cost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  medicationDetails: {
    name: String,
    dosage: String,
    duration: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Treatment', treatmentSchema); 