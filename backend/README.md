# 🌸 Glow Reeba Beauty — Full-Stack Website

An academic makeup/beauty e-commerce project with a complete Node.js/Express backend integrated into the existing HTML/CSS/JS frontend.

---

## 📁 Project Structure

```
Glow-Reeba-Beauty/
├── frontend/               ← Original Makeup Project (frontend)
│   ├── index.html
│   ├── about.html
│   ├── products.html
│   ├── gallery.html
│   ├── contact.html        ← Updated: submits to backend API
│   ├── login.html          ← NEW: Signup / Login
│   ├── forgot-password.html← NEW: Password reset request
│   ├── reset-password.html ← NEW: Password reset form
│   ├── api.js              ← NEW: Central API integration helper
│   ├── script.js           ← Updated: WhatsApp cart checkout added
│   ├── style.css
│   ├── images/
│   └── admin/
│       └── dashboard.html  ← NEW: Full admin panel
│
└── backend/                ← Node.js/Express backend
    ├── server.js           ← Entry point
    ├── seed.js             ← Create admin account
    ├── .env.example        ← Environment variables template
    ├── package.json
    ├── config/
    │   └── db.js           ← MongoDB connection
    ├── models/
    │   ├── User.js         ← Customer & admin accounts
    │   ├── Product.js      ← Product catalog
    │   ├── Inquiry.js      ← Contact & quote inquiries
    │   └── Banner.js       ← Hero banner CMS
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── inquiryController.js
    │   ├── whatsappController.js
    │   └── adminController.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── inquiries.js
    │   ├── whatsapp.js
    │   └── admin.js
    ├── middleware/
    │   ├── auth.js         ← JWT protect + adminOnly guards
    │   └── upload.js       ← Multer image upload
    └── uploads/
        └── products/       ← Uploaded product images
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

### 2. Configure `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/glow_beauty
JWT_SECRET=your_long_random_secret_here
ADMIN_EMAIL=admin@glowreeba.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://127.0.0.1:5500
WHATSAPP_NUMBER=923001234567
```

### 3. Seed the Admin Account

```bash
node seed.js
# Output: ✅ Admin created: admin@glowreeba.com
```

### 4. Start the Backend Server

```bash
npm run dev        # development (with nodemon)
# OR
npm start          # production

# Server runs at: http://localhost:5000
# Health check:   http://localhost:5000/api/health
```

### 5. Open the Frontend

Open the frontend folder with **VS Code Live Server** (port 5500) or any static file server:

```bash
# Using Python
cd frontend
python -m http.server 5500
```

Then open: `http://127.0.0.1:5500/index.html`

---

## 🔑 Admin Access

1. Go to `http://127.0.0.1:5500/login.html`
2. Login with:
   - Email: `admin@glowreeba.com`
   - Password: `Admin@123`
3. You'll be redirected to the Admin Dashboard

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password` | Public | Reset password |
| GET | `/api/auth/profile` | Customer | Get profile |
| PUT | `/api/auth/profile` | Customer | Update profile |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List products (with filters) |
| GET | `/api/products/:id` | Public | Get single product |
| GET | `/api/products/admin/all` | Admin | All products incl. inactive |
| POST | `/api/products` | Admin | Create product (multipart) |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Soft-delete product |

### Inquiries
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/inquiries` | Public | Submit contact/inquiry form |
| GET | `/api/inquiries` | Admin | List all inquiries |
| PUT | `/api/inquiries/:id` | Admin | Update status/notes |
| DELETE | `/api/inquiries/:id` | Admin | Delete inquiry |

### WhatsApp
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/whatsapp/product` | Public | Generate product inquiry link |
| POST | `/api/whatsapp/cart` | Public | Generate cart order link |
| POST | `/api/whatsapp/general` | Public | Generate general chat link |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | List all customers |
| GET/POST | `/api/admin/banners` | Admin | Manage hero banners |
| PUT/DELETE | `/api/admin/banners/:id` | Admin | Edit/delete banner |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| Validation | express-validator |

---

## ✨ Features Added

- ✅ User signup, login, logout (JWT-based)
- ✅ Forgot & reset password (email link)
- ✅ Secure admin login with role-based access
- ✅ Admin dashboard (stats, products, inquiries, banners, users)
- ✅ Product CRUD with image upload
- ✅ Contact/inquiry form stores to database
- ✅ WhatsApp integration: cart orders + product quotes + general chat
- ✅ All existing frontend design preserved 100%

---

*Academic Project — Reeba Manzoor, Roll No: 25BSSW010*
