const pool = require('../config/database');

class CategoryRepository {
    async findAll() {
        const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(nome, descricao = null) {
        const result = await pool.query(
            'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *',
            [nome, descricao]
        );
        return result.rows[0];
    }

    async update(id, nome, descricao) {
        const result = await pool.query(
            'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
            [nome, descricao, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    async existsWithProducts(id) {
        const result = await pool.query('SELECT COUNT(*) as count FROM produtos WHERE categoria_id = $1', [id]);
        return parseInt(result.rows[0].count) > 0;
    }
}

module.exports = new CategoryRepository();
