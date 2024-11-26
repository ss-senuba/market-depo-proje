const express = require('express');
const router = express.Router();
const { create,add_product } = require('../controllers/main_depo_controller');

// Depo rotaları
router.post('/create', create);
router.post('/:warehouseId/add-product', add_product);

module.exports = router;
