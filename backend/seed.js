/**
 * Run once to create the admin account:
 *   node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const connectDB = require('./config/db');

(async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@glowreeba.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`✅ Admin created: ${email}`);
  }

  mongoose.disconnect();
})();
