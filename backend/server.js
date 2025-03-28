const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB without deprecated options
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes
const checkoutRoutes = require('./routes/checkoutRoutes'); // Import checkout routes
const cardDetailsRoutes = require('./routes/cardDetailsRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // Use cart routes
app.use('/api/checkout', checkoutRoutes); // Use checkout routes
app.use('/api/card-details', cardDetailsRoutes);
app.use('/api/orders', orderRoutes)

let PORT = process.env.PORT || 5000;

// Function to start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is in use. Trying another port...`);
      PORT++;
      startServer();
    } else {
      throw err;
    }
  });
};

startServer();

// Optional: Graceful shutdown
process.on('SIGTERM', () => {
  if (app.server) {
    app.server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});
