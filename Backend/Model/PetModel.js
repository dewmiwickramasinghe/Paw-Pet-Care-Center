const mongoose = require("mongoose");

require('dotenv').config(); // To load environment variables

// Use petDBConnection (from the main app) for this model
const petDBConnection = mongoose.createConnection(
   "mongodb+srv://Thiyuni:2001@cluster0.fzk7s.mongodb.net/pets",  // Changed to petDB
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Error handling for connection
petDBConnection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
petDBConnection.once('open', () => {
  console.log('MongoDB connected successfully to petDB');
});

const petSchema = new mongoose.Schema({
  petname: { 
    type: String, 
    required: true, 
    minlength: 3,
    maxlength: 100
  },
  pettype: { 
    type: String, 
    required: true, 
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
  },
  age: { 
    type: String, 
    required: true,
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female']
  },
  breed: { 
    type: String, 
    required: true 
  },
  colour: { 
    type: String, 
    required: true 
  }
});

// Create a Pet model using the schema
module.exports = mongoose.model("Pet", petSchema);
