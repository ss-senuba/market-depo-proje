const express = require('express');
const router = express.Router();
const { create_market, request_product,update_market,delete_market,list_markets } = require('../controllers/market_controller');

// Market rotaları
router.post('/create', create_market);
router.post('/:marketId/request-product', request_product);
router.put('/:marketId/update', update_market);
router.delete('/:marketId/delete', delete_market);
router.get('/list', list_markets);

module.exports = router;
