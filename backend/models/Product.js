const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Face', 'Eyes', 'Lips', 'Skincare', 'Other'],
      default: 'Other',
    },
    images:  { type: [String], default: [] },   // stored filenames
    stock:   { type: Number, default: 0, min: 0 },
    featured:{ type: Boolean, default: false },
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
