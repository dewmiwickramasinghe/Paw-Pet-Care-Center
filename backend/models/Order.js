const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{ type: Object }],
    total: { type: Number },
    paymentMethod: { type: String },
    shippingAddress: { type: String },
    orderDate: { type: Date },
    orderStatus: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
