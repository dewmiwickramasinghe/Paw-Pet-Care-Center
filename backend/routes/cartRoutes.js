const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// API endpoint to get cart data
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

// API endpoint to add a product to the cart
router.post('/add', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            // Create a new cart
            cart = new Cart({ userId: userId, items: [{ productId: productId, quantity: 1 }], total: 0 });
        } else {
            // Check if the product already exists in the cart
            const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (productIndex > -1) {
                // Product already exists in the cart, update quantity
                cart.items[productIndex].quantity += 1;
            } else {
                // Product not in cart, add it
                cart.items.push({ productId: productId, quantity: 1 });
            }
        }

        // Calculate the updated cart total
        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.productId.price, 0);

        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully', cart: cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

// API endpoint to remove a product from the cart
router.post('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the product from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Calculate the updated cart total
        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.productId.price, 0);

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart successfully', cart: cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Failed to remove from cart' });
    }
});

module.exports = router;
