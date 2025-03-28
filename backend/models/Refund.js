const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    orderId: { type: String },
    reason: { type: String },
    orderDetails: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Refund', refundSchema);
