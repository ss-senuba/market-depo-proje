const express = require('express');
const router = express.Router();
const { register, login ,update,delete_user,get_list} = require('../controllers/user_controller');

router.post('/register', register);
router.post('/login', login);
router.put('/update/:userId', update);
router.delete('/delete/:userId', delete_user);
router.get('/get-list', get_list);

module.exports = router;
