const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cardNumberMasked: { type: String, required: true },
  expiry: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema],
  payment: PaymentSchema,
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Paid' },
  deliveryStatus: { type: String, default: 'Pending' }, // <-- Add this line
});

module.exports = mongoose.model('Order', OrderSchema);
