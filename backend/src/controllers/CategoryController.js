const CategoryService = require('../services/CategoryService');
const { validateCategoryInput } = require('../utils/validators');
const AppError = require('../utils/errors');

class CategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryById(id);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { nome, descricao } = req.body;

            const errors = validateCategoryInput({ nome, descricao });
            if (errors.length > 0) {
                throw new AppError('Validação falhou', 400, { errors });
            }

            const category = await CategoryService.createCategory(nome, descricao);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;

            const errors = validateCategoryInput({ nome });
            if (errors.length > 0) {
                throw new AppError('Validação falhou', 400, { errors });
            }

            const category = await CategoryService.updateCategory(id, nome, descricao);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
