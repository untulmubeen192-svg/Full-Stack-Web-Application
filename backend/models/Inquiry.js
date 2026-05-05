const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true, trim: true },
    phone:   { type: String, default: '' },
    message: { type: String, required: true },
    source:  { type: String, enum: ['form', 'whatsapp'], default: 'form' },
    status:  {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
    /* optional: linked product for quote requests */
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    productName: { type: String, default: '' },
    adminNotes:  { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
