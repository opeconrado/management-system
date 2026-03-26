const ProductService = require('../services/ProductService');
const { validateProductInput } = require('../utils/validators');
const AppError = require('../utils/errors');

class ProductController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, search, categoria_id, status } = req.query;
            const filters = {};

            if (search) filters.search = search;
            if (categoria_id) filters.categoria_id = categoria_id;
            if (status) filters.status = status;

            const products = await ProductService.getAllProducts(
                parseInt(page),
                parseInt(limit),
                filters
            );
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { nome, sku, estoque_inicial, categoria_id, estoque_minimo, imagem_url } = req.body;

            const errors = validateProductInput({
                nome,
                sku,
                estoque_inicial,
                categoria_id,
                estoque_minimo,
            });
            if (errors.length > 0) {
                throw new AppError('Validação falhou', 400, { errors });
            }

            const product = await ProductService.createProduct(
                nome,
                sku,
                parseInt(estoque_inicial),
                parseInt(categoria_id),
                estoque_minimo ? parseInt(estoque_minimo) : 10,
                imagem_url
            );
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, sku, estoque_minimo, categoria_id, imagem_url } = req.body;

            const errors = validateProductInput({
                nome,
                sku,
                estoque_inicial: 0,
                categoria_id,
                estoque_minimo,
            });
            if (errors.length > 0) {
                throw new AppError('Validação falhou', 400, { errors });
            }

            const product = await ProductService.updateProduct(
                id,
                nome,
                sku,
                estoque_minimo ? parseInt(estoque_minimo) : 10,
                parseInt(categoria_id),
                imagem_url
            );
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getLowStock(req, res, next) {
        try {
            const products = await ProductService.getLowStockProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getZeroStock(req, res, next) {
        try {
            const products = await ProductService.getZeroStockProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getStats(req, res, next) {
        try {
            const stats = await ProductService.getStockStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
