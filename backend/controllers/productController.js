const path    = require('path');
const fs      = require('fs');
const Product = require('../models/Product');

/* ── PUBLIC: Get all active products ── */
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 20 } = req.query;
    const filter = { active: true };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search)   filter.name = { $regex: search, $options: 'i' };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── PUBLIC: Get single product ── */
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.active)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Create product ── */
exports.createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.filename) : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Update product ── */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = [
        ...product.images,
        ...req.files.map(f => f.filename),
      ];
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Delete product (soft delete) ── */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Delete a single image from product ── */
exports.deleteImage = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    product.images = product.images.filter(img => img !== filename);
    await product.save();

    // Remove file from disk
    const filePath = path.join(__dirname, '../uploads/products', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Get all products (including inactive) ── */
exports.adminGetProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
