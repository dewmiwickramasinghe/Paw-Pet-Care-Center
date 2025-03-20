const express = require('express');
const Receipt = require('../models/Receipt');

const router = express.Router();

// Save receipt
router.post('/save', async (req, res) => {
    try {
        const newReceipt = new Receipt(req.body);
        const savedReceipt = await newReceipt.save();
        res.status(201).json(savedReceipt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
