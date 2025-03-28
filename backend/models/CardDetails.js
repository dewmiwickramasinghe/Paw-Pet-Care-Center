// backend/models/CardDetails.js
const mongoose = require('mongoose');

const cardDetailsSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CardDetails', cardDetailsSchema);
