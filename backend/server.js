const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Addtocart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Cart Schema
const cartSchema = new mongoose.Schema({
    items: Array,
    total: Number,
});

const Cart = mongoose.model('Cart', cartSchema, 'carts');

// Order Schema
const orderSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    items: Array,
    total: Number,
    paymentMethod: String,
    shippingAddress: String,
    orderDate: Date,
    orderStatus: { type: String, default: 'Pending Shipment' }, // Default status
});

const Order = mongoose.model('Order', orderSchema, 'orders');

// Refund Schema
const refundSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    reason: String,
    status: { type: String, default: 'Pending' },
    requestDate: Date,
});

const Refund = mongoose.model('Refund', refundSchema, 'refunds');

// GET Orders Endpoint
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// GET single Order Endpoint
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// GET single Cart Endpoint
app.get('/carts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

// PUT Endpoint to Update Order Status
app.put('/orders/status/:id', async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body; // Expecting `orderStatus` in request body

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true } // Return the updated document
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

// GET Refunds Endpoint
app.get('/refunds', async (req, res) => {
    try {
        const refunds = await Refund.find();
        res.json(refunds);
    } catch (error) {
        console.error('Error fetching refunds:', error);
        res.status(500).json({ message: 'Error fetching refunds' });
    }
});
// PUT Endpoint to Update Refund Status
app.put('/refunds/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRefund = await Refund.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRefund) {
            return res.status(404).json({ message: 'Refund not found' });
        }
        res.json(updatedRefund);
    } catch (error) {
        console.error('Error updating refund:', error);
        res.status(500).json({ message: 'Error updating refund' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome Financial Manager');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
