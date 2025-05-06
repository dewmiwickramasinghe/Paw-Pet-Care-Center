const mongoose = require('mongoose');

const CancelledOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  items: [Object],
  payment: Object,
  total: Number,
  createdAt: Date,
  deliveryStatus: String,
  cancellationReason: { type: String, required: true },
  cancelledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CancelledOrder', CancelledOrderSchema);
