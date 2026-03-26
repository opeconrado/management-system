const CategoryRepository = require('../repositories/CategoryRepository');
const AppError = require('../utils/errors');

class CategoryService {
    async getAllCategories() {
        return await CategoryRepository.findAll();
    }

    async getCategoryById(id) {
        const category = await CategoryRepository.findById(id);
        if (!category) {
            throw new AppError('Categoria não encontrada', 404);
        }
        return category;
    }

    async createCategory(nome, descricao) {
        return await CategoryRepository.create(nome, descricao);
    }

    async updateCategory(id, nome, descricao) {
        await this.getCategoryById(id);
        return await CategoryRepository.update(id, nome, descricao);
    }

    async deleteCategory(id) {
        await this.getCategoryById(id);
        const hasProducts = await CategoryRepository.existsWithProducts(id);
        if (hasProducts) {
            throw new AppError('Não é possível deletar uma categoria com produtos', 400);
        }
        return await CategoryRepository.delete(id);
    }
}

module.exports = new CategoryService();
