const MovementService = require('../services/MovementService');
const { validateMovementInput } = require('../utils/validators');
const AppError = require('../utils/errors');

class MovementController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, produto_id, tipo, data_inicio, data_fim } = req.query;
            const filters = {};

            if (produto_id) filters.produto_id = produto_id;
            if (tipo) filters.tipo = tipo;
            if (data_inicio && data_fim) {
                filters.data_inicio = data_inicio;
                filters.data_fim = data_fim;
            }

            const movements = await MovementService.getAllMovements(
                parseInt(page),
                parseInt(limit),
                filters
            );
            res.json(movements);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const movement = await MovementService.getMovementById(id);
            res.json(movement);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { produto_id, tipo, quantidade } = req.body;

            const errors = validateMovementInput({
                produto_id,
                tipo,
                quantidade,
            });
            if (errors.length > 0) {
                throw new AppError('Validação falhou', 400, { errors });
            }

            const movement = await MovementService.createMovement(
                parseInt(produto_id),
                tipo,
                parseInt(quantidade)
            );
            res.status(201).json(movement);
        } catch (error) {
            next(error);
        }
    }

    async registerBarcode(req, res, next) {
        try {
            const { sku } = req.body;

            if (!sku) {
                throw new AppError('SKU é obrigatório', 400);
            }

            const movement = await MovementService.registerBarcodeMovement(sku);
            res.status(201).json(movement);
        } catch (error) {
            next(error);
        }
    }

    async getByDateRange(req, res, next) {
        try {
            const { data_inicio, data_fim } = req.query;

            if (!data_inicio || !data_fim) {
                throw new AppError('data_inicio e data_fim são obrigatórias', 400);
            }

            const movements = await MovementService.getMovementsByDateRange(data_inicio, data_fim);
            res.json(movements);
        } catch (error) {
            next(error);
        }
    }

    async getProductHistory(req, res, next) {
        try {
            const { produto_id } = req.params;
            const { days = 30 } = req.query;

            const history = await MovementService.getProductMovementHistory(
                parseInt(produto_id),
                parseInt(days)
            );
            res.json(history);
        } catch (error) {
            next(error);
        }
    }

    async getABCCurve(req, res, next) {
        try {
            const abcData = await MovementService.getABCCurveData();
            res.json(abcData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MovementController();
