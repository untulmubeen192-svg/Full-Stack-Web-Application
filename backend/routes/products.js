const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload  = require('../middleware/upload');

/* Public */
router.get('/',           ctrl.getProducts);
router.get('/:id',        ctrl.getProduct);

/* Admin */
router.get('/admin/all',  protect, adminOnly, ctrl.adminGetProducts);
router.post('/',          protect, adminOnly, upload.array('images', 6), ctrl.createProduct);
router.put('/:id',        protect, adminOnly, upload.array('images', 6), ctrl.updateProduct);
router.delete('/:id',     protect, adminOnly, ctrl.deleteProduct);
router.delete('/:id/images/:filename', protect, adminOnly, ctrl.deleteImage);

module.exports = router;
