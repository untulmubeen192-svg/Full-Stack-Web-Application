const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true,
    },
    phone: { type: String, trim: true, default: '' },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },

    /* password reset */
    resetToken:       { type: String, default: null },
    resetTokenExpiry: { type: Date,   default: null },
  },
  { timestamps: true }
);

/* Hash password before save */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* Compare password */
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
