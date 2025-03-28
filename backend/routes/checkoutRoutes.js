const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// Create a new order
router.post('/place-order', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error placing order' });
    }
});

module.exports = router;
