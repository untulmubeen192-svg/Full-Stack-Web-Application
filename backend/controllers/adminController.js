const User    = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const Banner  = require('../models/Banner');

/* ── Dashboard stats ── */
exports.getStats = async (req, res) => {
  try {
    const [users, products, inquiries, newInquiries, banners] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ active: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Banner.countDocuments({ active: true }),
    ]);

    res.status(200).json({
      success: true,
      stats: { users, products, inquiries, newInquiries, activeBanners: banners },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── List all users ── */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────── BANNER / CONTENT MANAGEMENT ─────── */

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : '';
    const banner = await Banner.create({ ...req.body, image });
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.filename;
    const banner = await Banner.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!banner)
      return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
