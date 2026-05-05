const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    subtitle: { type: String, default: '' },
    ctaText:  { type: String, default: 'Shop Collection' },
    ctaLink:  { type: String, default: 'products.html' },
    image:    { type: String, default: '' },   // filename
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
