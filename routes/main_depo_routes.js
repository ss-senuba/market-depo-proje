const express = require('express');
const router = express.Router();
const { create, add_product, update, delete_depo, list } = require('../controllers/main_depo_controller');

// Depo rotaları
router.post('/create', create);
router.post('/:warehouseId/add-product', add_product);
router.put('/update/:warehouseId', update);
router.delete('/delete/:warehouseId',delete_depo);
router.get('/get-list', list); 
module.exports = router;
