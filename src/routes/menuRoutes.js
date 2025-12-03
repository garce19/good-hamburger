const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenuItems);
router.get('/sandwiches', menuController.getSandwiches);
router.get('/extras', menuController.getExtras);

module.exports = router;