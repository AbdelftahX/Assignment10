const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/', userController.updateUser);
router.delete('/', userController.deleteUser);
router.get('/', userController.getUser);

module.exports = router;