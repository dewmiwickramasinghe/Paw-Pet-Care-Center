const express = require('express');
const router = express.Router();
const Checkout = require('../models/Checkout');

// API endpoint to save checkout details
router.post('/save', async (req, res) => {
    const { shippingAddress } = req.body;

    if (!shippingAddress || shippingAddress.trim() === '') {
        return res.status(400).json({ message: 'Shipping address is required.' });
    }

    try {
        const checkoutData = new Checkout(req.body);
        await checkoutData.save();
        res.status(201).json({ message: 'Checkout details saved successfully' });
    } catch (error) {
        console.error('Error saving checkout details:', error);
        res.status(500).json({ message: 'Failed to save checkout details' });
    }
});

module.exports = router;
