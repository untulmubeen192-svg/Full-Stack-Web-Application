const Inquiry = require('../models/Inquiry');

const WA_NUMBER = () => process.env.WHATSAPP_NUMBER || '923001234567';

/* ── PUBLIC: Generate WhatsApp link for a product inquiry ── */
exports.generateProductLink = async (req, res) => {
  try {
    const { productName, price, productId } = req.body;

    if (!productName)
      return res.status(400).json({ success: false, message: 'productName is required' });

    const message = encodeURIComponent(
      `Hi! I'm interested in *${productName}*${price ? ` (PKR ${price})` : ''}.\n` +
      `Could you please provide more details or availability?\n\n` +
      `Thank you!`
    );

    const link = `https://wa.me/${WA_NUMBER()}?text=${message}`;

    /* Log inquiry */
    if (req.body.name && req.body.email) {
      await Inquiry.create({
        name:        req.body.name,
        email:       req.body.email,
        phone:       req.body.phone || '',
        message:     `WhatsApp inquiry for: ${productName}`,
        source:      'whatsapp',
        productId:   productId   || null,
        productName: productName || '',
      });
    }

    res.status(200).json({ success: true, link });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ── PUBLIC: Generate WhatsApp link for a general message ── */
exports.generateGeneralLink = (req, res) => {
  const { message } = req.body;
  const text = message
    ? encodeURIComponent(message)
    : encodeURIComponent('Hi! I would like to get in touch with Glow Reeba Beauty.');

  const link = `https://wa.me/${WA_NUMBER()}?text=${text}`;
  res.status(200).json({ success: true, link });
};

/* ── PUBLIC: Generate cart / order inquiry link ── */
exports.generateCartLink = (req, res) => {
  const { items } = req.body; // [{ name, qty, price }]
  if (!items || !items.length)
    return res.status(400).json({ success: false, message: 'Cart items required' });

  const lines = items.map(i => `• ${i.name} × ${i.qty}  —  PKR ${i.price * i.qty}`).join('\n');
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const raw   = `Hi! I'd like to place an order:\n\n${lines}\n\n*Total: PKR ${total}*\n\nPlease confirm availability. Thank you!`;
  const link  = `https://wa.me/${WA_NUMBER()}?text=${encodeURIComponent(raw)}`;

  res.status(200).json({ success: true, link });
};
