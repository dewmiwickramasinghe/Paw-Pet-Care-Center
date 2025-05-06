const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const app = express();

// MongoDB connection using .env variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Middleware
app.use(cors());

// Increase payload size limit for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
const upload = multer({ storage });

// Routes
const inventory = require('./routes/InventoryItems.js');
const categories = require('./routes/Catagory.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const storeItemRoutes = require('./routes/storeItemRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js'); // <-- ADD THIS LINE

app.use(inventory);
app.use(categories);
app.use(uploadRoutes);
app.use('/store-items', storeItemRoutes);
app.use('/api', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Error Handling Middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
