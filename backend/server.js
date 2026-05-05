require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const app = express();

/* ── Database ── */
connectDB();

/* ── Middleware ── */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Static — serve uploaded product images ── */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ── API Routes ── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/whatsapp',  require('./routes/whatsapp'));
app.use('/api/admin',     require('./routes/admin'));

/* ── Health check ── */
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Glow Beauty API is running 🌸' })
);

/* ── 404 handler ── */
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Glow Beauty API running at http://localhost:${PORT}`)
);
