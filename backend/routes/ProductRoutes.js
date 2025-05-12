const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create a product
router.post('/', async (req, res) => {
  const { name, url, targetPrice, email } = req.body;
  try {
    const product = new Product({
      name,
      url,
      targetPrice,
      email: email,
      currentPrice: null,
      lastChecked: null,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});


// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product price (for demonstration)
// routes/products.js or wherever your update logic is
router.put('/:id', async (req, res) => {
  console.log("Updating product with ID:", req.params.id);
  console.log("Data received:", req.body);

  const { targetPrice, email } = req.body;

  if (!targetPrice || !email) {
    return res.status(400).json({ error: 'Both targetPrice and email are required.' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { targetPrice, email },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});



module.exports = router;
