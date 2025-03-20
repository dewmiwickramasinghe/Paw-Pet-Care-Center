const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const productRoutes = require('./routes/productRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes
const checkoutRoutes = require('./routes/checkoutRoutes'); // Import checkout routes

app.use('/api/products', productRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/cart', cartRoutes); // Use cart routes
app.use('/api/checkout', checkoutRoutes); // Use checkout routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
