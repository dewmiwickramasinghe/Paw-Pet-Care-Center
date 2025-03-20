const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    items: [{
        name: String,
        price: Number,
        quantity: Number,
    }],
    total: Number,
    paymentMethod: String,
    cardDetails: {
        cardNumber: String,
        expiryDate: String,
        cvv: String,
        cardHolderName: String,
    },
    timestamp: Date,
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
