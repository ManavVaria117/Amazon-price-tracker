const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('🛒 Amazon Price Tracker is running!');
});

// Product routes
const productRoutes = require('./routes/ProductRoutes');
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    require('./bot'); // Start the bot after DB connection
  })
  .catch(err => console.error('❌ MongoDB error:', err.message));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on PORT: ${PORT}`);
});
