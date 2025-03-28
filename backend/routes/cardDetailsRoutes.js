const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CardDetails = require('../models/CardDetails');

router.post('/save', async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv, cardHolderName } = req.body;

    // Create a new CardDetails object
    const newCardDetails = new CardDetails({
      cardNumber,
      expiryDate,
      cvv,
      cardHolderName
    });

    // Save the new card details to the database
    const savedCardDetails = await newCardDetails.save();

    // Respond with the saved card details
    res.status(201).json(savedCardDetails);
  } catch (error) {
    console.error('Error saving card details:', error);
    res.status(500).json({ message: 'Failed to save card details' });
  }
});

module.exports = router;
