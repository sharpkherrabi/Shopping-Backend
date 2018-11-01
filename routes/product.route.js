const express = require('express');
const router = express.Router();
const productCreateController = require('../controllers/createProduct.controller');
const productUpdateController = require('../controllers/updateProduct.controller');
const productGetController = require('../controllers/getProduct.controller');
const productDeleteController = require('../controllers/deleteProduct.controller');

router.post('/create', productCreateController);
router.put('/update/:productId', productUpdateController);
router.get('/get/:productId?', productGetController);
router.delete('/delete/:productId?', productDeleteController);

module.exports = router;