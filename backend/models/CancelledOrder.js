const mongoose = require('mongoose');

const cancelledOrderSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    orderDate: { type: Date },
    cancellationReason: { type: String, required: true },
    cancellationDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('CancelledOrder', cancelledOrderSchema);
