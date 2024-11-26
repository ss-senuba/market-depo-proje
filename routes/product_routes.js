const express = require('express');
const router = express.Router();
const { create_product } = require('../controllers/product_controller');

// Ürün rotaları
router.post('/create', create_product);

module.exports = router;
