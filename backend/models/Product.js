const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    targetPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      default: null
    },
    lastCheckedPrice: {
      type: Number,
      default: null
    },
    lastChecked: {
      type: Date,
      default: null
    },
    lastNotified: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
