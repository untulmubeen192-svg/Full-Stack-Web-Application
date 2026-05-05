const Inquiry = require('../models/Inquiry');

/* ── PUBLIC: Submit inquiry / contact form ── */
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, source, productId, productName } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });

    const inquiry = await Inquiry.create({
      name, email, phone, message,
      source:      source || 'form',
      productId:   productId   || null,
      productName: productName || '',
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Get all inquiries ── */
exports.getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('productId', 'name price');

    res.status(200).json({ success: true, total, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Get single inquiry ── */
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('productId', 'name price');
    if (!inquiry)
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Update inquiry status / notes ── */
exports.updateInquiry = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!inquiry)
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── ADMIN: Delete inquiry ── */
exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
