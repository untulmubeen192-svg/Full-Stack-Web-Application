const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/auth');

/* Public */
router.post('/', ctrl.submitInquiry);

/* Admin */
router.get('/',       protect, adminOnly, ctrl.getInquiries);
router.get('/:id',    protect, adminOnly, ctrl.getInquiry);
router.put('/:id',    protect, adminOnly, ctrl.updateInquiry);
router.delete('/:id', protect, adminOnly, ctrl.deleteInquiry);

module.exports = router;
