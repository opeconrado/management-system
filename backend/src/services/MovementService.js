const MovementRepository = require('../repositories/MovementRepository');
const ProductRepository = require('../repositories/ProductRepository');
const AppError = require('../utils/errors');

class MovementService {
    async getAllMovements(page = 1, limit = 10, filters = {}) {
        return await MovementRepository.findAll(page, limit, filters);
    }

    async getMovementById(id) {
        const movement = await MovementRepository.findById(id);
        if (!movement) {
            throw new AppError('Movimentação não encontrada', 404);
        }
        return movement;
    }

    async createMovement(produto_id, tipo, quantidade) {
        // Verify product exists
        const product = await ProductRepository.findById(produto_id);
        if (!product) {
            throw new AppError('Produto não encontrado', 404);
        }

        // Validate movement type
        const tipoLower = tipo.toLowerCase();
        if (!['entrada', 'saída'].includes(tipoLower)) {
            throw new AppError('Tipo inválido. Use "entrada" ou "saída"', 400);
        }

        // If it's an exit, check if there's enough stock
        if (tipoLower === 'saída' && product.estoque_atual < quantidade) {
            throw new AppError('Estoque insuficiente para esta saída', 400, {
                available: product.estoque_atual,
                requested: quantidade,
            });
        }

        // Create movement
        const movement = await MovementRepository.create(produto_id, tipoLower, quantidade);

        // Update product stock
        const newStock = tipoLower === 'entrada'
            ? product.estoque_atual + quantidade
            : product.estoque_atual - quantidade;

        await ProductRepository.updateStockLevel(produto_id, newStock);

        return movement;
    }

    async registerBarcodeMovement(sku) {
        const product = await ProductRepository.findBySku(sku);
        if (!product) {
            throw new AppError('Produto com este SKU não encontrado', 404);
        }

        return await this.createMovement(product.id, 'entrada', 1);
    }

    async getMovementsByDateRange(dataInicio, dataFim) {
        return await MovementRepository.getMovementsByDateRange(dataInicio, dataFim);
    }

    async getProductMovementHistory(produtoId, days = 30) {
        const product = await ProductRepository.findById(produtoId);
        if (!product) {
            throw new AppError('Produto não encontrado', 404);
        }

        return await MovementRepository.getProductMovementHistory(produtoId, days);
    }

    async getABCCurveData() {
        const data = await MovementRepository.getABCCurveData();

        const totalMovements = data.reduce((sum, item) => sum + (item.total_movimentacoes || 0), 0);

        let accumulatedPercentage = 0;
        const categorizedData = data.map(item => {
            const percentage = totalMovements > 0 ? (item.total_movimentacoes / totalMovements) * 100 : 0;
            accumulatedPercentage += percentage;

            let category = 'C';
            if (accumulatedPercentage <= 80) {
                category = 'A';
            } else if (accumulatedPercentage <= 95) {
                category = 'B';
            }

            return {
                ...item,
                categoria: category,
                percentual: parseFloat(percentage.toFixed(2)),
                acumulado: parseFloat(accumulatedPercentage.toFixed(2)),
            };
        });

        return categorizedData;
    }
}

module.exports = new MovementService();
