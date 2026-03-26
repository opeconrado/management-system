const ProductRepository = require('../repositories/ProductRepository');
const MovementRepository = require('../repositories/MovementRepository');
const CategoryRepository = require('../repositories/CategoryRepository');
const AppError = require('../utils/errors');

class ProductService {
    async getAllProducts(page = 1, limit = 10, filters = {}) {
        return await ProductRepository.findAll(page, limit, filters);
    }

    async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new AppError('Produto não encontrado', 404);
        }
        return product;
    }

    async createProduct(nome, sku, estoque_inicial, categoria_id, estoque_minimo = 10, imagem_url = null) {
        // Verify category exists
        const category = await CategoryRepository.findById(categoria_id);
        if (!category) {
            throw new AppError('Categoria não encontrada', 404);
        }

        // Check if SKU is unique
        const existingSku = await ProductRepository.findBySku(sku);
        if (existingSku) {
            throw new AppError('SKU já existe', 400, { field: 'sku' });
        }

        // Create product
        const product = await ProductRepository.create(
            nome,
            sku,
            estoque_inicial,
            categoria_id,
            estoque_minimo,
            imagem_url
        );

        // Create initial movement record
        if (estoque_inicial > 0) {
            await MovementRepository.create(product.id, 'entrada', estoque_inicial);
        }

        return product;
    }

    async updateProduct(id, nome, sku, estoque_minimo, categoria_id, imagem_url) {
        await this.getProductById(id);

        // Verify category exists
        const category = await CategoryRepository.findById(categoria_id);
        if (!category) {
            throw new AppError('Categoria não encontrada', 404);
        }

        // Check if new SKU is unique (excluding current product)
        const existingSku = await ProductRepository.findBySku(sku);
        if (existingSku && existingSku.id !== id) {
            throw new AppError('SKU já existe', 400, { field: 'sku' });
        }

        return await ProductRepository.update(id, nome, sku, estoque_minimo, categoria_id, imagem_url);
    }

    async deleteProduct(id) {
        await this.getProductById(id);
        return await ProductRepository.delete(id);
    }

    async getLowStockProducts() {
        return await ProductRepository.getLowStockProducts();
    }

    async getZeroStockProducts() {
        return await ProductRepository.getZeroStockProducts();
    }

    async getStockStats() {
        return await ProductRepository.getStockStats();
    }
}

module.exports = new ProductService();
