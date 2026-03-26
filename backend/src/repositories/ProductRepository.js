const pool = require('../config/database');

class ProductRepository {
    async findAll(page = 1, limit = 10, filters = {}) {
        let query = 'SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id';
        const params = [];
        const conditions = [];

        if (filters.search) {
            conditions.push('(p.nome ILIKE $' + (params.length + 1) + ' OR p.sku ILIKE $' + (params.length + 1) + ')');
            params.push('%' + filters.search + '%');
        }

        if (filters.categoria_id) {
            conditions.push('p.categoria_id = $' + (params.length + 1));
            params.push(filters.categoria_id);
        }

        if (filters.status) {
            if (filters.status === 'zerado') {
                conditions.push('p.estoque_atual = 0');
            } else if (filters.status === 'baixo') {
                conditions.push('p.estoque_atual > 0 AND p.estoque_atual <= p.estoque_minimo');
            } else if (filters.status === 'normal') {
                conditions.push('p.estoque_atual > p.estoque_minimo');
            }
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const offset = (page - 1) * limit;
        const countResult = await pool.query('SELECT COUNT(*) FROM produtos p' + (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''), params);
        const totalCount = parseInt(countResult.rows[0].count);

        query += ' ORDER BY p.nome LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);
        return {
            data: result.rows,
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit),
        };
    }

    async findById(id) {
        const result = await pool.query(
            'SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = $1',
            [id]
        );
        return result.rows[0];
    }

    async findBySku(sku) {
        const result = await pool.query('SELECT * FROM produtos WHERE sku = $1', [sku]);
        return result.rows[0];
    }

    async create(nome, sku, estoque_inicial, categoria_id, estoque_minimo = 10, imagem_url = null) {
        const result = await pool.query(
            'INSERT INTO produtos (nome, sku, estoque_atual, estoque_minimo, categoria_id, imagem_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, sku, estoque_inicial, estoque_minimo, categoria_id, imagem_url]
        );
        return result.rows[0];
    }

    async update(id, nome, sku, estoque_minimo, categoria_id, imagem_url) {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, sku = $2, estoque_minimo = $3, categoria_id = $4, imagem_url = $5 WHERE id = $6 RETURNING *',
            [nome, sku, estoque_minimo, categoria_id, imagem_url, id]
        );
        return result.rows[0];
    }

    async updateStockLevel(id, quantidade) {
        const result = await pool.query(
            'UPDATE produtos SET estoque_atual = $1 WHERE id = $2 RETURNING *',
            [quantidade, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    async getLowStockProducts() {
        const result = await pool.query(
            'SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.estoque_atual <= p.estoque_minimo ORDER BY p.estoque_atual ASC'
        );
        return result.rows;
    }

    async getZeroStockProducts() {
        const result = await pool.query(
            'SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.estoque_atual = 0 ORDER BY p.nome'
        );
        return result.rows;
    }

    async getStockStats() {
        const result = await pool.query(`
      SELECT
        COUNT(*) as total_produtos,
        SUM(estoque_atual) as total_estoque,
        COUNT(CASE WHEN estoque_atual = 0 THEN 1 END) as produtos_zerados,
        COUNT(CASE WHEN estoque_atual > 0 AND estoque_atual <= estoque_minimo THEN 1 END) as produtos_baixo
      FROM produtos
    `);
        return result.rows[0];
    }
}

module.exports = new ProductRepository();
