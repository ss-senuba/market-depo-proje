const express = require('express');
const router = express.Router();
const { create_sub_depo, request_product,update_sub_depo,delete_sub_depo,list_sub_depos } = require('../controllers/sub_depo_controller');

// Alt depo rotaları
router.post('/create', create_sub_depo);
router.post('/:subWarehouseId/request-product', request_product); 
router.put('/:subWarehouseId/update',update_sub_depo);
router.delete('/:subWarehouseId/delete', delete_sub_depo);
router.get('/:parentWarehouseId/subs',list_sub_depos);

module.exports = router;
