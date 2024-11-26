const express = require('express');
const router = express.Router();
const { create_market, request_product } = require('../controllers/market_controller');

// Market rotaları
router.post('/create', create_market);
router.post('/:marketId/request-product', request_product);

module.exports = router;
