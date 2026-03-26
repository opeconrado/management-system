const express = require('express');
const router = express.Router();
const MovementController = require('../controllers/MovementController');

router.get('/', MovementController.getAll.bind(MovementController));
router.get('/abc-curve', MovementController.getABCCurve.bind(MovementController));
router.get('/by-date-range', MovementController.getByDateRange.bind(MovementController));
router.get('/product/:produto_id/history', MovementController.getProductHistory.bind(MovementController));
router.get('/:id', MovementController.getById.bind(MovementController));
router.post('/', MovementController.create.bind(MovementController));
router.post('/barcode/register', MovementController.registerBarcode.bind(MovementController));

module.exports = router;
