const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {   // Add the name attribute
            type: String,
            required: true
        },
        price: {  // Add the price attribute
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    total: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingAddress: { // include shipping address
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
