const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.getAll.bind(ProductController));
router.get('/stats/overview', ProductController.getStats.bind(ProductController));
router.get('/low-stock', ProductController.getLowStock.bind(ProductController));
router.get('/zero-stock', ProductController.getZeroStock.bind(ProductController));
router.get('/:id', ProductController.getById.bind(ProductController));
router.post('/', ProductController.create.bind(ProductController));
router.put('/:id', ProductController.update.bind(ProductController));
router.delete('/:id', ProductController.delete.bind(ProductController));

module.exports = router;
