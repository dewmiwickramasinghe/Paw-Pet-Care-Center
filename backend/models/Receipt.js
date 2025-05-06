const mongoose = require('mongoose');

const ReceiptItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const ReceiptPaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cardNumberMasked: { type: String, required: true },
  expiry: { type: String, required: true },
});

const ReceiptSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  items: [ReceiptItemSchema],
  payment: ReceiptPaymentSchema,
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
