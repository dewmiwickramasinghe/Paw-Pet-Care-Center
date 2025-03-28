const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Refund = require('../models/Refund');

// Get all orders
router.get('/my-orders', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
// Cancel an order
router.put('/cancel/:orderId', async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const reason = req.body.reason;
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Save order details to refund database
      const refund = new Refund({
          orderId: orderId,
          reason: reason,
          orderDetails: order
      });
      await refund.save();

      // Remove order from orders database
      await Order.findByIdAndDelete(orderId);

      res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error cancelling order' });
  }
});

module.exports = router;
