const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/whatsappController');

router.post('/product', ctrl.generateProductLink);
router.post('/general', ctrl.generateGeneralLink);
router.post('/cart',    ctrl.generateCartLink);

module.exports = router;
