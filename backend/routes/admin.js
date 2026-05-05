const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.use(protect, adminOnly); // all admin routes are protected

router.get('/stats',        ctrl.getStats);
router.get('/users',        ctrl.getUsers);

/* Banners */
router.get('/banners',          ctrl.getBanners);
router.post('/banners',         upload.single('image'), ctrl.createBanner);
router.put('/banners/:id',      upload.single('image'), ctrl.updateBanner);
router.delete('/banners/:id',   ctrl.deleteBanner);

module.exports = router;
