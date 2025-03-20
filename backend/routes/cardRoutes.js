const express = require('express');
const Card = require('../models/Card');

const router = express.Router();

// Add card details (FOR SIMULATION ONLY - DO NOT STORE RAW CARD DETAILS)
router.post('/add', async (req, res) => {
    try {
        // Simulate card verification and encryption before storing
        const newCard = new Card(req.body);
        const savedCard = await newCard.save();
        res.status(201).json(savedCard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all cards (FOR SIMULATION ONLY)
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
