const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const ctrl     = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], ctrl.signup);

router.post('/login',           ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password',  ctrl.resetPassword);

router.get('/profile',    protect, ctrl.getProfile);
router.put('/profile',    protect, ctrl.updateProfile);

module.exports = router;
