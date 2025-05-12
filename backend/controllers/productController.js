const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// POST /api/products
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, image, price, priceDrop, priceHistory } = req.body;

    const newProduct = new Product({
      title,
      image,
      price,
      priceDrop,
      priceHistory,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      priceDrop: product.priceDrop,
      priceHistory: product.priceHistory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProduct, getProductById };
