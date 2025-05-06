const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Receipt = require('../models/Receipt');
const CancelledOrder = require('../models/CancelledOrder'); // Make sure this model exists

// Utility function to mask card number except last 4 digits
function maskCardNumber(cardNumber) {
  return "**** **** **** " + cardNumber.slice(-4);
}

// POST /api/orders - Create a new order and receipt
router.post('/orders', async (req, res) => {
  try {
    console.log("Received order data:", JSON.stringify(req.body, null, 2)); 
    const { cart, payment, total } = req.body;

    // Mask card number before saving for security
    const maskedPayment = {
      name: payment.name,
      cardNumberMasked: maskCardNumber(payment.cardNumber),
      expiry: payment.expiry,
    };

    // Create and save order
    const order = new Order({
      items: cart,
      payment: maskedPayment,
      total,
      deliveryStatus: 'Pending', // Default status
    });
    await order.save();

    // Create and save receipt linked to order
    const receipt = new Receipt({
      orderId: order._id,
      items: cart,
      payment: maskedPayment,
      total,
      date: new Date(),
    });
    await receipt.save();

    // Return receipt ID as confirmation
    res.json({ orderId: receipt._id });
  } catch (err) {
    console.error("Order failed:", err);
    res.status(500).json({ message: "Order failed", error: err.message });
  }
});

// GET /api/orders - Fetch all orders, sorted by newest first
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders failed:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


// GET /api/orders/:id - Fetch a single order by ID (optional, for details)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Fetch order failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/orders/:id/cancel - Cancel an order with a reason
router.post('/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === '') {
    return res.status(400).json({ message: 'Cancellation reason is required' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.deliveryStatus === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered orders' });
    }

    // Move order to CancelledOrders collection
    const cancelledOrder = new CancelledOrder({
      orderId: order._id,
      items: order.items,
      payment: order.payment,
      total: order.total,
      createdAt: order.createdAt,
      deliveryStatus: order.deliveryStatus,
      cancellationReason: reason,
    });
    await cancelledOrder.save();

    // Remove from active orders
    await Order.findByIdAndDelete(id);

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/receipt/:id - Fetch receipt by receipt ID
router.get('/receipt/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });
    res.json(receipt);
  } catch (err) {
    console.error("Fetch receipt failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
