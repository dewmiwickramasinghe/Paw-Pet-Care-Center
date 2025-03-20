const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products or filter by category/search
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;