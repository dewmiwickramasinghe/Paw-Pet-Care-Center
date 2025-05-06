const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// --- Define models ONCE at the top ---
const cancelledOrderSchema = new mongoose.Schema({}, { strict: false });
const CancelledOrder = mongoose.models.cancelledorder || mongoose.model('cancelledorder', cancelledOrderSchema, 'cancelledorders');

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.order || mongoose.model('order', orderSchema, 'orders');

// --- Cancelled Orders Endpoints ---
app.get('/api/cancelledorders', async (req, res) => {
  try {
    const orders = await CancelledOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cancelledorders/total', async (req, res) => {
  try {
    const result = await CancelledOrder.aggregate([
      { $group: { _id: null, totalRefund: { $sum: "$total" } } }
    ]);
    const total = result[0]?.totalRefund || 0;
    res.json({ totalRefund: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cancelledorders/:id', async (req, res) => {
  try {
    const deletedOrder = await CancelledOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order successfully removed', order: deletedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Orders Endpoints ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    if (!deliveryStatus) {
      return res.status(400).json({ error: 'deliveryStatus is required' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// --- Financial Reports Endpoints ---
app.get('/api/financial/revenue', async (req, res) => {
  try {
    const { timeFrame } = req.query;
    let matchStage = {};
    let groupStage = {};

    if (timeFrame === 'daily') {
      matchStage = { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } };
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 }
      };
    } else {
      matchStage = { createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } };
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 }
      };
    }

    const result = await Order.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }
    ]);

    res.json(result.map(item => ({
      [timeFrame === 'daily' ? 'date' : 'month']: item._id,
      total: item.total || 0,
      count: item.count || 0
    })));
  } catch (err) {
    console.error('Error fetching revenue data:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/financial/refunds', async (req, res) => {
  try {
    const { timeFrame } = req.query;
    let matchStage = {};
    let groupStage = {};

    if (timeFrame === 'daily') {
      matchStage = { cancelledAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } };
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$cancelledAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 }
      };
    } else {
      matchStage = { cancelledAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } };
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$cancelledAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 }
      };
    }

    const result = await CancelledOrder.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }
    ]);

    res.json(result.map(item => ({
      [timeFrame === 'daily' ? 'date' : 'month']: item._id,
      total: item.total || 0,
      count: item.count || 0
    })));
  } catch (err) {
    console.error('Error fetching refund data:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
