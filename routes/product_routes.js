const express = require('express');
const router = express.Router();
const { create_product,update_product,delete_product,list_products } = require('../controllers/product_controller');

// Ürün rotaları
router.post('/create', create_product);
router.put('/:id', update_product);
router.delete('/:id',delete_product);
router.get('/get-products',list_products);
module.exports = router;
