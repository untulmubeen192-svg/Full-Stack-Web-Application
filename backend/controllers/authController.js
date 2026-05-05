const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/* ── helpers ── */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:    user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
    },
  });
};

/* ── SIGNUP ── */
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() });

  const { name, email, phone, password } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, phone, password });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── LOGIN ── */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── FORGOT PASSWORD ── */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: 'Email required' });

  try {
    const user = await User.findOne({ email });
    // Always respond 200 to prevent email enumeration
    if (!user)
      return res.status(200).json({ success: true, message: 'Reset link sent if email exists' });

    const token  = crypto.randomBytes(32).toString('hex');
    user.resetToken       = token;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;

    /* Send email */
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Glow Reeba Beauty" <${process.env.EMAIL_USER}>`,
      to:   user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Reset link sent if email exists' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── RESET PASSWORD ── */
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ success: false, message: 'Token and new password required' });

  try {
    const user = await User.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password         = password;
    user.resetToken       = null;
    user.resetTokenExpiry = null;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── GET PROFILE (authenticated) ── */
exports.getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

/* ── UPDATE PROFILE ── */
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
