const express = require('express');
const router = express.Router();
const { create_sub_depo, request_product } = require('../controllers/sub_depo_controller');

// Alt depo rotaları
router.post('/create', create_sub_depo);
router.post('/:subWarehouseId/request-product', request_product); // Bu satırı ekledik

module.exports = router;
